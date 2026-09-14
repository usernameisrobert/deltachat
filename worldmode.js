class OverworldGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // Player position and movement
        this.player = {
            x: 1290, // Spawn at specified coordinates
            y: 1696, // Spawn at specified coordinates
            width: 32,
            height: 32,
            speed: 3
        };
        
        // Animation system
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 15; // frames between animation updates
        this.currentDirection = 'up'; // Face up at spawn
        this.isMoving = false;
        
        // Collision maps
        this.backgroundImage = null;
        this.collisionImage = null;
        this.collisionCanvas = document.createElement('canvas');
        this.collisionCtx = this.collisionCanvas.getContext('2d');
        
        // Player sprites
        this.playerSprites = {
            down: ['/kd1d.png', '/kd2d.png', '/kd3d.png', '/kd4d.png'],
            up: ['/ku1d.png', '/ku2d.png', '/ku3d.png', '/ku4d.png'],
            left: ['/kl1d.png', '/kl2d.png', '/kl3d.png', '/kl4d.png'],
            right: ['/kr1d.png', '/kr2d.png', '/kr3d.png', '/kr4d.png']
        };
        this.loadedSprites = {};
        
        // Susie sprites
        this.susieSprites = {
            down: ['/sd1d.png', '/sd2d.png', '/sd3d.png', '/sd4d.png'],
            up: ['/su1d.png', '/su2d.png', '/su3d.png', '/su4d.png'],
            left: ['/sl1d.png', '/sl2d.png', '/sl3d.png', '/sl4d.png'],
            right: ['/sr1d.png', '/sr2d.png', '/sr3d.png', '/sr4d.png']
        };
        this.loadedSusieSprites = {};
        
        // Susie position and following system
        this.susie = {
            x: 576,
            y: 193,
            direction: 'down',
            animationFrame: 0,
            animationTimer: 0,
            isFollowing: false,
            isMoving: false,
            followDistance: 48, // Distance to maintain from Kris
            speed: 3,
            // AI system
            aiActive: false,
            currentSequence: null,
            sequenceIndex: 0,
            pathfindingTarget: null,
            pathfindingPath: [],
            waitTimer: 0,
            isExecutingAction: false
        };
        
        // Party trail system
        this.playerTrail = [];
        this.maxTrailLength = 500; // Keep 500 frames of history
        this.trailFollowDistance = 30; // Susie follows 30 frames behind
        
        // Input handling
        this.keys = {};
        this.dialogueActive = false;
        this.dialogueZPressBlocked = false;
        
        // Global interaction state - mutable variable
        this.interact = 0;
        
        // AI dialogue system
        this.aiDialogueActive = false;
        this.currentAIDialogue = null;
        this.aiDialogueIndex = 0;
        this.aiIsTyping = false;
        this.aiTypewriterTimeout = null;
        
        // Camera
        this.camera = { x: 0, y: 0 };
        
        // Dev mode
        this.devMode = false;
        this.noclip = false;
        this.devOverlay = null;
        
        this.init();
    }
    
    init() {
        this.loadAssets();
        this.setupEventListeners();
        this.gameLoop();
    }
    
    loadAssets() {
        // Load background
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => {
            console.log('Background loaded');
        };
        this.backgroundImage.src = '/school.png';
        
        // Load collision map
        this.collisionImage = new Image();
        this.collisionImage.onload = () => {
            this.collisionCanvas.width = this.collisionImage.width;
            this.collisionCanvas.height = this.collisionImage.height;
            this.collisionCtx.drawImage(this.collisionImage, 0, 0);
            console.log('Collision map loaded');
        };
        this.collisionImage.src = '/school-hitbox.png';
        
        // Load player sprites
        Object.keys(this.playerSprites).forEach(direction => {
            this.loadedSprites[direction] = [];
            this.playerSprites[direction].forEach((src, index) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Loaded sprite: ${direction}[${index}]`);
                };
                img.onerror = () => {
                    console.error(`Failed to load sprite: ${src}`);
                };
                img.src = src;
                this.loadedSprites[direction][index] = img;
            });
        });
        
        // Load Susie sprites
        Object.keys(this.susieSprites).forEach(direction => {
            this.loadedSusieSprites[direction] = [];
            this.susieSprites[direction].forEach((src, index) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`Loaded Susie sprite: ${direction}[${index}]`);
                };
                img.onerror = () => {
                    console.error(`Failed to load Susie sprite: ${src}`);
                };
                img.src = src;
                this.loadedSusieSprites[direction][index] = img;
            });
        });
    }
    
    loadImage(src) {
        if (this.loadedImages.has(src)) {
            return this.loadedImages.get(src);
        }
        
        const img = new Image();
        img.onload = () => {
            console.log(`Loaded image: ${src}`);
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
        };
        img.src = src;
        this.loadedImages.set(src, img);
        return img;
    }
    
    createEntity(x, y, imageSrc, layer = 1, scale = 1.5) {
        const entity = {
            x: x,
            y: y,
            imageSrc: imageSrc,
            layer: layer,
            scale: scale,
            width: 32, // Default width
            height: 32, // Default height
            visible: true,
            image: this.loadImage(imageSrc)
        };
        
        this.entities.push(entity);
        return entity;
    }
    
    createAnimatedEntity(x, y, sprites, layer = 1, scale = 1.5) {
        const entity = {
            x: x,
            y: y,
            sprites: sprites,
            layer: layer,
            scale: scale,
            width: 32,
            height: 32,
            visible: true,
            direction: 'down',
            animationFrame: 0,
            animationTimer: 0,
            animationSpeed: 60,
            isAnimated: true
        };
        
        this.entities.push(entity);
        return entity;
    }
    
    setupEventListeners() {
        // Movement keys
        document.addEventListener('keydown', (e) => {
            // Only register key presses if not interacting
            if (this.interact === 0) {
                this.keys[e.code] = true;
            }
            
            // Dev mode toggle
            if (e.code === 'F3') {
                this.toggleDevMode();
                e.preventDefault();
            }
            
            // Interaction - only if dialogue is not active, z-press is not blocked, and not currently interacting
            if ((e.code === 'KeyZ' || e.code === 'Enter') && this.interact === 0 && !this.dialogueZPressBlocked) {
                const scale = 3;
                const interactionResult = this.checkInteraction(this.player.x / scale, this.player.y / scale, this.currentDirection);
                if (interactionResult.type !== 'none') {
                    this.showInteractionDialogue(interactionResult.type);
                }
                e.preventDefault();
            }
            
            // Exit world - only if not interacting
            if (e.code === 'Escape' && this.interact === 0) {
                if (window.susieDialogue) {
                    window.susieDialogue.exitOverworld();
                }
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            // Only register key releases if not interacting
            if (this.interact === 0) {
                this.keys[e.code] = false;
            }
        });
    }
    
    toggleDevMode() {
        this.devMode = !this.devMode;
        
        if (this.devMode) {
            this.createDevOverlay();
        } else {
            this.removeDevOverlay();
        }
    }
    
    updateDevOverlay() {
        if (!this.devMode || !this.devOverlay) return;
        
        document.getElementById('dev-position').textContent = `${Math.round(this.player.x)}, ${Math.round(this.player.y)}`;
        document.getElementById('dev-camera').textContent = `${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`;
        document.getElementById('dev-direction').textContent = this.currentDirection;
        document.getElementById('dev-moving').textContent = this.isMoving;
        document.getElementById('dev-interact').textContent = this.interact;
    }
    
    createDevOverlay() {
        if (this.devOverlay) return;
        
        this.devOverlay = document.createElement('div');
        this.devOverlay.id = 'overworld-dev-overlay';
        this.devOverlay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 15px;
            border: 2px solid #fff;
            font-family: 'Undertale', 'Courier Prime', monospace;
            font-size: 12px;
            line-height: 1.4;
            z-index: 3001;
            min-width: 200px;
        `;
        
        this.devOverlay.innerHTML = `
            <div><strong>DEV MODE</strong></div>
            <div>F3 to toggle</div>
            <div>---</div>
            <div>Position: <span id="dev-position">0, 0</span></div>
            <div>Camera: <span id="dev-camera">0, 0</span></div>
            <div>Direction: <span id="dev-direction">up</span></div>
            <div>Moving: <span id="dev-moving">false</span></div>
            <div>Interact: <span id="dev-interact">0</span></div>
            <div>---</div>
            <button id="noclip-toggle" style="
                background-color: #000;
                color: #fff;
                border: 2px solid #fff;
                padding: 5px 10px;
                font-family: 'Undertale', 'Courier Prime', monospace;
                font-size: 10px;
                cursor: pointer;
                margin-top: 5px;
            ">Noclip: OFF</button>
        `;
        
        document.body.appendChild(this.devOverlay);
        
        // Add noclip toggle listener
        document.getElementById('noclip-toggle').addEventListener('click', () => {
            this.noclip = !this.noclip;
            document.getElementById('noclip-toggle').textContent = `Noclip: ${this.noclip ? 'ON' : 'OFF'}`;
            document.getElementById('noclip-toggle').style.color = this.noclip ? '#88ff88' : '#fff';
        });
    }
    
    removeDevOverlay() {
        if (this.devOverlay) {
            this.devOverlay.remove();
            this.devOverlay = null;
        }
    }
    
    checkSusieInteraction() {
        // Check if player is close enough to Susie to interact
        const distance = Math.sqrt(
            Math.pow(this.player.x - this.susie.x, 2) + 
            Math.pow(this.player.y - this.susie.y, 2)
        );
        
        // Don't allow interaction if Susie is following
        if (this.susie.isFollowing) {
            return false;
        }
        
        return distance < 48; // Within 48 pixels
    }
    
    showInteractionDialogue(interactionType = 'yellow') {
        // Check if interacting with Susie entity
        if (this.checkSusieInteraction()) {
            this.showSusieDialogue();
            return;
        }
        
        // Set interaction state to 2 when dialogue starts
        this.interact = 2;
        this.dialogueActive = true;
        this.dialogueZPressBlocked = true;
        
        console.log('Setting interact to 2, current value:', this.interact);
        
        // Create world dialogue box
        this.createWorldDialogue(interactionType === 'yellow' ? "* You feel like there should be something here, but there isn't yet." : "* This seems like an exit or entrance. You could probably leave through here.");
    }
    
    createWorldDialogue(message) {
        // Remove any existing world dialogue
        this.closeWorldDialogue();
        
        // Create world dialogue container
        const worldDialogueContainer = document.createElement('div');
        worldDialogueContainer.id = 'world-dialogue-container';
        worldDialogueContainer.className = 'world-dialogue-container';
        
        // Create textbox
        const worldTextbox = document.createElement('div');
        worldTextbox.className = 'world-textbox';
        
        // Create text content
        const worldTextContent = document.createElement('div');
        worldTextContent.id = 'world-dialogue-text';
        worldTextContent.className = 'world-textbox-content';
        worldTextContent.textContent = message;
        
        worldTextbox.appendChild(worldTextContent);
        worldDialogueContainer.appendChild(worldTextbox);
        
        // Add to body
        document.body.appendChild(worldDialogueContainer);
        
        // Set up close listener
        this.worldDialogueCloseListener = (e) => {
            if (e.key === 'z' || e.key === 'Z' || e.key === 'Enter' || e.key === 'Escape') {
                this.closeWorldDialogue();
            }
        };
        
        document.addEventListener('keydown', this.worldDialogueCloseListener);
    }
    
    closeWorldDialogue() {
        // Remove world dialogue container
        const worldDialogueContainer = document.getElementById('world-dialogue-container');
        if (worldDialogueContainer) {
            worldDialogueContainer.remove();
        }
        
        // Remove event listener
        if (this.worldDialogueCloseListener) {
            document.removeEventListener('keydown', this.worldDialogueCloseListener);
            this.worldDialogueCloseListener = null;
        }
        
        // Reset interaction state
        this.interact = 0;
        this.dialogueActive = false;
        
        console.log('World dialogue closed, interact reset to 0');
        
        // Add a small delay before re-enabling z-press checks
        setTimeout(() => {
            this.dialogueZPressBlocked = false;
        }, 100);
    }
    
    showSusieDialogue() {
        // Set interaction state to 2 when dialogue starts
        this.interact = 2;
        this.dialogueActive = true;
        this.dialogueZPressBlocked = true;
        this.aiDialogueActive = true;
        
        console.log('Setting interact to 2 for Susie dialogue, current value:', this.interact);
        
        // Generate AI dialogue for Susie
        this.generateSusieAIDialogue();
    }
    
    async generateSusieAIDialogue() {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Susie from Deltarune. Generate a sequence of actions for Susie when Kris interacts with her in the overworld. 

Susie is a tough, sarcastic purple dragon girl who acts mean but has a good heart. She's rebellious, loves causing trouble, and uses casual/rough language. She's defensive about being called nice but does care about her friends.

STAY IN CHARACTER ALWAYS: Every dialogue line must be something Susie would actually say — no narration, no "OOC", no meta talk, no acknowledging she is in a game or an AI. Every word is Susie speaking aloud.

Create a sequence that makes Susie start following Kris around. The sequence should include dialogue and actions.

Available action types:
- "dialogue": Shows dialogue with text, character, and expression
- "follow": Makes Susie start following Kris in a party trail system
- "lookindirection": Makes Susie look in a direction (up, down, left, right)
- "moveindirection": Makes Susie move in a direction for a certain distance
- "wait": Makes Susie wait for a number of frames

Respond with JSON containing a sequence array:
{
  "sequence": [
    {
      "type": "dialogue",
      "text": "dialogue text here",
      "character": "susie",
      "expression": "expression_name"
    },
    {
      "type": "follow"
    }
  ]
}`
                    }
                ],
                json: true
            });
            
            const response = JSON.parse(completion.content);
            const sequence = response.sequence || [
                {
                    type: "dialogue",
                    text: "Hey Kris! Wait up!",
                    character: "susie",
                    expression: "happy"
                },
                {
                    type: "dialogue", 
                    text: "I'll follow you around now.",
                    character: "susie",
                    expression: "smile"
                },
                {
                    type: "follow"
                },
                {
                    type: "dialogue",
                    text: "Lead the way!",
                    character: "susie", 
                    expression: "determined"
                }
            ];
            
            // Start AI sequence
            this.startAISequence(sequence);
            
        } catch (error) {
            console.error('Error generating Susie AI dialogue:', error);
            
            // Fallback sequence
            const fallbackSequence = [
                {
                    type: "dialogue",
                    text: "Hey Kris! Wait up!",
                    character: "susie",
                    expression: "happy"
                },
                {
                    type: "dialogue", 
                    text: "I'll follow you around now.",
                    character: "susie",
                    expression: "smile"
                },
                {
                    type: "follow"
                },
                {
                    type: "dialogue",
                    text: "Lead the way!",
                    character: "susie", 
                    expression: "determined"
                }
            ];
            
            this.startAISequence(fallbackSequence);
        }
    }
    
    startAISequence(sequence) {
        this.susie.currentSequence = sequence;
        this.susie.sequenceIndex = 0;
        this.susie.aiActive = true;
        this.executeNextAIAction();
    }
    
    executeNextAIAction() {
        if (!this.susie.currentSequence || this.susie.sequenceIndex >= this.susie.currentSequence.length) {
            // Sequence complete
            this.susie.aiActive = false;
            this.susie.currentSequence = null;
            this.susie.sequenceIndex = 0;
            this.closeAIDialogue();
            return;
        }
        
        const action = this.susie.currentSequence[this.susie.sequenceIndex];
        this.susie.isExecutingAction = true;
        
        switch (action.type) {
            case "dialogue":
                this.showAIDialogue(action);
                break;
            case "follow":
                this.executeFollowAction();
                break;
            case "lookindirection":
                this.executeLookAction(action.direction);
                break;
            case "moveindirection":
                this.executeMoveAction(action.direction, action.distance || 32);
                break;
            case "wait":
                this.executeWaitAction(action.frames || 60);
                break;
        }
    }
    
    showAIDialogue(action) {
        this.currentAIDialogue = action;
        this.createAIDialogue(action.text);
    }
    
    executeFollowAction() {
        // Make Susie start following
        this.susie.isFollowing = true;
        this.playerTrail = []; // Clear any existing trail
        console.log('Susie is now following Kris!');
        
        // Move to next action
        this.susie.sequenceIndex++;
        this.susie.isExecutingAction = false;
        this.executeNextAIAction();
    }
    
    executeLookAction(direction) {
        this.susie.direction = direction;
        this.susie.animationFrame = 0; // Standing frame
        
        // Move to next action
        this.susie.sequenceIndex++;
        this.susie.isExecutingAction = false;
        this.executeNextAIAction();
    }
    
    executeMoveAction(direction, distance) {
        // Calculate target position
        const targetX = this.susie.x + (direction === 'left' ? -distance : direction === 'right' ? distance : 0);
        const targetY = this.susie.y + (direction === 'up' ? -distance : direction === 'down' ? distance : 0);
        
        this.susie.pathfindingTarget = { x: targetX, y: targetY };
        this.susie.direction = direction;
        
        // Start pathfinding (simplified - direct movement)
        this.updateSusiePathfinding();
    }
    
    executeWaitAction(frames) {
        this.susie.waitTimer = frames;
        this.updateSusieWait();
    }
    
    updateSusiePathfinding() {
        if (!this.susie.pathfindingTarget) return;
        
        const targetX = this.susie.pathfindingTarget.x;
        const targetY = this.susie.pathfindingTarget.y;
        
        // Calculate distance to target
        const dx = targetX - this.susie.x;
        const dy = targetY - this.susie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.susie.speed) {
            // Reached target
            this.susie.x = targetX;
            this.susie.y = targetY;
            this.susie.pathfindingTarget = null;
            this.susie.animationFrame = 0;
            this.susie.isMoving = false;
            
            // Move to next action
            this.susie.sequenceIndex++;
            this.susie.isExecutingAction = false;
            this.executeNextAIAction();
        } else {
            // Move towards target
            const moveX = (dx / distance) * this.susie.speed;
            const moveY = (dy / distance) * this.susie.speed;
            
            // Check collision
            const scale = 3;
            const newX = this.susie.x + moveX;
            const newY = this.susie.y + moveY;
            
            if (!this.checkCollision(newX / scale, newY / scale)) {
                this.susie.x = newX;
                this.susie.y = newY;
                this.susie.isMoving = true;
                
                // Update animation
                this.susie.animationTimer++;
                if (this.susie.animationTimer >= this.animationSpeed) {
                    this.susie.animationFrame = (this.susie.animationFrame + 1) % 4;
                    this.susie.animationTimer = 0;
                }
            } else {
                // Collision - stop pathfinding
                this.susie.pathfindingTarget = null;
                this.susie.animationFrame = 0;
                this.susie.isMoving = false;
                
                // Move to next action
                this.susie.sequenceIndex++;
                this.susie.isExecutingAction = false;
                this.executeNextAIAction();
            }
        }
    }
    
    updateSusieWait() {
        if (this.susie.waitTimer > 0) {
            this.susie.waitTimer--;
            this.susie.animationFrame = 0;
            this.susie.isMoving = false;
        } else {
            // Wait complete
            this.susie.sequenceIndex++;
            this.susie.isExecutingAction = false;
            this.executeNextAIAction();
        }
    }
    
    createAIDialogue(message) {
        // Remove any existing world dialogue
        this.closeWorldDialogue();
        
        // Create world dialogue container
        const worldDialogueContainer = document.createElement('div');
        worldDialogueContainer.id = 'world-dialogue-container';
        worldDialogueContainer.className = 'world-dialogue-container';
        
        // Create textbox
        const worldTextbox = document.createElement('div');
        worldTextbox.className = 'world-textbox';
        
        // Create text content
        const worldTextContent = document.createElement('div');
        worldTextContent.id = 'world-dialogue-text';
        worldTextContent.className = 'world-textbox-content';
        worldTextContent.textContent = message;
        
        worldTextbox.appendChild(worldTextContent);
        worldDialogueContainer.appendChild(worldTextbox);
        
        // Add to body
        document.body.appendChild(worldDialogueContainer);
        
        // Set up close listener
        this.worldDialogueCloseListener = (e) => {
            if (e.key === 'z' || e.key === 'Z' || e.key === 'Enter' || e.key === 'Escape') {
                this.closeWorldDialogue();
            }
        };
        
        document.addEventListener('keydown', this.worldDialogueCloseListener);
    }
    
    closeAIDialogue() {
        // Check if this is the last dialogue and if it's a character interaction
        if (this.susie.currentSequence && this.susie.sequenceIndex >= this.susie.currentSequence.length - 1) {
            // This is the last dialogue - open interactive textbox instead of closing
            this.openInteractiveTextbox();
            return;
        }
        
        // Remove world dialogue container
        const worldDialogueContainer = document.getElementById('world-dialogue-container');
        if (worldDialogueContainer) {
            worldDialogueContainer.remove();
        }
        
        // Clear typewriter timeout
        if (this.aiTypewriterTimeout) {
            clearTimeout(this.aiTypewriterTimeout);
            this.aiTypewriterTimeout = null;
        }
        
        // Remove event listener
        if (this.worldDialogueCloseListener) {
            document.removeEventListener('keydown', this.worldDialogueCloseListener);
            this.worldDialogueCloseListener = null;
        }
        
        // Reset AI dialogue state
        this.aiDialogueActive = false;
        this.currentAIDialogue = null;
        this.aiDialogueIndex = 0;
        this.aiIsTyping = false;
        
        // Reset interaction state
        this.interact = 0;
        this.dialogueActive = false;
        
        // Reset Susie AI state
        this.susie.aiActive = false;
        this.susie.currentSequence = null;
        this.susie.sequenceIndex = 0;
        this.susie.isExecutingAction = false;
        
        console.log('AI dialogue closed, interact reset to 0');
        
        // Add a small delay before re-enabling z-press checks
        setTimeout(() => {
            this.dialogueZPressBlocked = false;
        }, 100);
    }
    
    openInteractiveTextbox() {
        // Remove any existing world dialogue
        const worldDialogueContainer = document.getElementById('world-dialogue-container');
        if (worldDialogueContainer) {
            worldDialogueContainer.remove();
        }
        
        // Create interactive textbox container
        const textboxContainer = document.createElement('div');
        textboxContainer.id = 'interactive-textbox-container';
        textboxContainer.className = 'world-dialogue-container';
        
        // Create textbox
        const textbox = document.createElement('div');
        textbox.className = 'world-textbox';
        textbox.style.height = '100px';
        textbox.style.padding = '10px';
        textbox.style.display = 'flex';
        textbox.style.alignItems = 'center';
        textbox.style.justifyContent = 'center';
        
        // Create input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.id = 'interactive-input';
        inputField.style.width = '500px';
        inputField.style.padding = '10px';
        inputField.style.fontSize = '18px';
        inputField.style.fontFamily = "'Undertale', 'Courier Prime', monospace";
        inputField.style.backgroundColor = '#000';
        inputField.style.color = '#fff';
        inputField.style.border = '2px solid #fff';
        inputField.style.outline = 'none';
        inputField.placeholder = 'Type your message...';
        inputField.maxLength = 100;
        
        textbox.appendChild(inputField);
        textboxContainer.appendChild(textbox);
        document.body.appendChild(textboxContainer);
        
        // Focus the input
        inputField.focus();
        
        // Set up event listeners
        this.interactiveTextboxListener = (e) => {
            if (e.key === 'Escape') {
                this.closeInteractiveTextbox();
            } else if (e.key === 'Enter') {
                const message = inputField.value.trim();
                if (message) {
                    this.sendInteractiveMessage(message);
                }
            }
        };
        
        document.addEventListener('keydown', this.interactiveTextboxListener);
    }
    
    closeInteractiveTextbox() {
        // Remove interactive textbox container
        const textboxContainer = document.getElementById('interactive-textbox-container');
        if (textboxContainer) {
            textboxContainer.remove();
        }
        
        // Remove event listener
        if (this.interactiveTextboxListener) {
            document.removeEventListener('keydown', this.interactiveTextboxListener);
            this.interactiveTextboxListener = null;
        }
        
        // Reset interaction state
        this.interact = 0;
        this.dialogueActive = false;
        this.aiDialogueActive = false;
        this.currentAIDialogue = null;
        this.aiDialogueIndex = 0;
        this.aiIsTyping = false;
        
        // Reset Susie AI state
        this.susie.aiActive = false;
        this.susie.currentSequence = null;
        this.susie.sequenceIndex = 0;
        this.susie.isExecutingAction = false;
        
        console.log('Interactive textbox closed, interact reset to 0');
        
        // Add a small delay before re-enabling z-press checks
        setTimeout(() => {
            this.dialogueZPressBlocked = false;
        }, 100);
    }
    
    async sendInteractiveMessage(message) {
        // Clear input field
        const inputField = document.getElementById('interactive-input');
        if (inputField) {
            inputField.value = '';
            inputField.disabled = true;
        }
        
        try {
            // Generate AI response
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are Susie from Deltarune in an overworld interaction. The user (Kris) has just typed a message to you. Respond as Susie would - she's tough, sarcastic, but has a good heart. Keep responses conversational and in-character. Write full sentences that lean toward the 70-character maximum; don't write clipped one- or two-word lines.

STAY IN CHARACTER ALWAYS: Every line must be something Susie would genuinely say — no narration, no "OOC", no meta talk, no acknowledging she is in a game or an AI. Every word is Susie speaking aloud.

Generate a sequence of actions for Susie's response. 

Available action types:
- "dialogue": Shows dialogue with text, character, and expression
- "follow": Makes Susie start following Kris in a party trail system
- "lookindirection": Makes Susie look in a direction (up, down, left, right)
- "moveindirection": Makes Susie move in a direction for a certain distance
- "wait": Makes Susie wait for a number of frames

Most responses should just be dialogue, but you can add other actions if they fit the context.

Respond with JSON containing a sequence array:
{
  "sequence": [
    {
      "type": "dialogue",
      "text": "response text here",
      "character": "susie",
      "expression": "expression_name"
    }
  ]
}`
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                json: true
            });
            
            const response = JSON.parse(completion.content);
            const sequence = response.sequence || [
                {
                    type: "dialogue",
                    text: "Huh? What are you talking about?",
                    character: "susie",
                    expression: "skeptical"
                }
            ];
            
            // Close interactive textbox
            this.closeInteractiveTextbox();
            
            // Start new AI sequence
            this.startAISequence(sequence);
            
        } catch (error) {
            console.error('Error generating interactive response:', error);
            
            // Fallback response
            const fallbackSequence = [
                {
                    type: "dialogue",
                    text: "Uh... what?",
                    character: "susie",
                    expression: "confused"
                }
            ];
            
            // Close interactive textbox
            this.closeInteractiveTextbox();
            
            // Start fallback sequence
            this.startAISequence(fallbackSequence);
        }
    }
    
    update() {
        // Don't update player movement if interacting (interact >= 1)
        if (this.interact >= 1) {
            this.updateDevOverlay();
            return;
        }
        
        const prevX = this.player.x;
        const prevY = this.player.y;
        this.isMoving = false;
        
        // Check if running (X key held) - only if not interacting
        const isRunning = this.interact === 0 && this.keys['KeyX'];
        const currentSpeed = isRunning ? this.player.speed * 2 : this.player.speed;
        const currentAnimationSpeed = isRunning ? this.animationSpeed / 2 : this.animationSpeed;
        
        // Movement input - only if not interacting
        if (this.interact === 0) {
            if (this.keys['KeyW'] || this.keys['ArrowUp']) {
                this.player.y -= currentSpeed;
                this.currentDirection = 'up';
                this.isMoving = true;
            }
            if (this.keys['KeyS'] || this.keys['ArrowDown']) {
                this.player.y += currentSpeed;
                this.currentDirection = 'down';
                this.isMoving = true;
            }
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
                this.player.x -= currentSpeed;
                this.currentDirection = 'left';
                this.isMoving = true;
            }
            if (this.keys['KeyD'] || this.keys['ArrowRight']) {
                this.player.x += currentSpeed;
                this.currentDirection = 'right';
                this.isMoving = true;
            }
        }
        
        // Check collision with 3x scale applied (only if noclip is disabled and not interacting)
        if (!this.noclip && this.interact === 0) {
            const scale = 3;
            if (this.checkCollision(this.player.x / scale, this.player.y / scale)) {
                this.player.x = prevX;
                this.player.y = prevY;
                this.isMoving = false;
            }
        }
        
        // Update animation - only if not interacting
        if (this.interact === 0) {
            if (this.isMoving) {
                this.animationTimer++;
                if (this.animationTimer >= currentAnimationSpeed) {
                    this.animationFrame = (this.animationFrame + 1) % 4;
                    this.animationTimer = 0;
                }
            } else {
                this.animationFrame = 0;
                this.animationTimer = 0;
            }
        }
        
        // Record player trail ONLY when moving and if Susie is following
        if (this.susie.isFollowing && this.interact === 0 && this.isMoving) {
            this.playerTrail.push({
                x: this.player.x,
                y: this.player.y,
                frame: this.animationFrame,
                direction: this.currentDirection,
                isMoving: this.isMoving
            });
            
            // Remove old trail entries (older than 500 frames)
            if (this.playerTrail.length > this.maxTrailLength) {
                this.playerTrail.shift();
            }
        }
        
        // Update Susie
        this.updateSusie();
        
        // Update camera to follow player with scale applied
        this.camera.x = this.player.x - this.canvas.width / 2;
        this.camera.y = this.player.y - this.canvas.height / 2;
        
        // Clamp camera to map bounds with scale applied (only if noclip is disabled)
        if (!this.noclip && this.backgroundImage) {
            const scale = 3;
            const scaledMapWidth = this.backgroundImage.width * scale;
            const scaledMapHeight = this.backgroundImage.height * scale;
            this.camera.x = Math.max(0, Math.min(scaledMapWidth - this.canvas.width, this.camera.x));
            this.camera.y = Math.max(0, Math.min(scaledMapHeight - this.canvas.height, this.camera.y));
        }
        
        // Update dev overlay
        this.updateDevOverlay();
    }
    
    updateSusie() {
        // Handle AI actions first
        if (this.susie.aiActive && this.susie.isExecutingAction) {
            if (this.susie.pathfindingTarget) {
                this.updateSusiePathfinding();
                return;
            }
            if (this.susie.waitTimer > 0) {
                this.updateSusieWait();
                return;
            }
        }
        
        if (!this.susie.isFollowing) {
            // Susie is not following, stay on frame 0 (standing still)
            this.susie.animationFrame = 0;
            this.susie.animationTimer = 0;
            this.susie.isMoving = false;
            return;
        }
        
        // Susie is following - use exact trail system
        if (this.playerTrail.length >= 30) {
            // Get the position from exactly 30 positions ago (from the latest)
            const targetIndex = this.playerTrail.length - 30;
            const targetPosition = this.playerTrail[targetIndex];
            
            // Move to the exact position
            this.susie.x = targetPosition.x;
            this.susie.y = targetPosition.y;
            this.susie.direction = targetPosition.direction;
            this.susie.animationFrame = targetPosition.frame;
            this.susie.isMoving = true;
        } else {
            // Not enough trail history yet, Susie stays still at original position
            this.susie.isMoving = false;
            this.susie.animationFrame = 0; // Frame 0 is standing still (sd1d, su1d, sl1d, sr1d)
        }
    }
    
    checkCollision(x, y) {
        // Don't process collision checks if interacting
        if (this.interact >= 1) return false;
        
        if (!this.collisionImage) return false;
        
        // Check four corners of player using actual sprite dimensions
        const currentSprite = this.loadedSprites[this.currentDirection]?.[this.animationFrame];
        let playerWidth, playerHeight;
        
        if (currentSprite && currentSprite.complete) {
            // Use actual sprite dimensions scaled by 1.5x and adjusted for map scale, with taller hitbox
            playerWidth = (currentSprite.width * 1.5) / 3;
            playerHeight = (currentSprite.height * 1.5) / 3 + 8; // Make hitbox 8 pixels taller
        } else {
            // Fallback to original dimensions with taller hitbox
            playerWidth = this.player.width / 3;
            playerHeight = this.player.height / 3 + 8; // Make hitbox 8 pixels taller
        }
        
        // Calculate the actual top-left corner of the sprite render area
        const spriteOffsetX = (playerWidth * 3 - this.player.width) / 6; // Half of the difference
        const spriteOffsetY = (playerHeight * 3 - this.player.height) / 6 - 6; // Half of the difference, moved up by 6 pixels
        const actualX = x - spriteOffsetX;
        const actualY = y - spriteOffsetY;
        
        const corners = [
            { x: actualX, y: actualY },
            { x: actualX + playerWidth - 1, y: actualY },
            { x: actualX, y: actualY + playerHeight - 1 },
            { x: actualX + playerWidth - 1, y: actualY + playerHeight - 1 }
        ];
        
        for (const corner of corners) {
            if (corner.x < 0 || corner.y < 0 || 
                corner.x >= this.collisionImage.width || 
                corner.y >= this.collisionImage.height) {
                return true; // Out of bounds
            }
            
            const pixel = this.collisionCtx.getImageData(corner.x, corner.y, 1, 1).data;
            const r = pixel[0];
            const g = pixel[1];
            const b = pixel[2];
            
            // Red pixels = walls, Green pixels = exits (also walls), Yellow pixels = walls
            if ((r > 200 && g < 50 && b < 50) || // Red
                (r < 50 && g > 200 && b < 50) ||   // Green
                (r > 200 && g > 200 && b < 50)) {   // Yellow
                return true;
            }
        }
        
        return false;
    }
    
    checkInteraction(x, y, direction) {
        // Don't process interaction checks if interacting
        if (this.interact >= 1) return { type: 'none' };
        
        if (!this.collisionImage) return false;
        
        // Use actual sprite dimensions for interaction check
        const currentSprite = this.loadedSprites[this.currentDirection]?.[this.animationFrame];
        let playerWidth, playerHeight;
        
        if (currentSprite && currentSprite.complete) {
            // Use actual sprite dimensions scaled by 1.5x and adjusted for map scale, with taller hitbox
            playerWidth = (currentSprite.width * 1.5) / 3;
            playerHeight = (currentSprite.height * 1.5) / 3 + 8; // Make hitbox 8 pixels taller
        } else {
            // Fallback to original dimensions with taller hitbox
            playerWidth = this.player.width / 3;
            playerHeight = this.player.height / 3 + 8; // Make hitbox 8 pixels taller
        }
        
        // Calculate the actual center of the sprite render area (matching collision system)
        const spriteOffsetX = (playerWidth * 3 - this.player.width) / 6; // Half of the difference
        const spriteOffsetY = (playerHeight * 3 - this.player.height) / 6 - 6; // Half of the difference, moved up by 6 pixels
        const actualCenterX = x - spriteOffsetX + playerWidth / 2;
        const actualCenterY = y - spriteOffsetY + playerHeight / 2;
        
        // Check pixel 3 units away from the center of the hitbox side in the facing direction
        let checkX = actualCenterX;
        let checkY = actualCenterY;
        
        switch (direction) {
            case 'up':
                checkY -= playerHeight / 2 + 3;
                break;
            case 'down':
                checkY += playerHeight / 2 + 3;
                break;
            case 'left':
                checkX -= playerWidth / 2 + 3;
                break;
            case 'right':
                checkX += playerWidth / 2 + 3;
                break;
        }
        
        if (checkX < 0 || checkY < 0 || 
            checkX >= this.collisionImage.width || 
            checkY >= this.collisionImage.height) {
            return { type: 'none' };
        }
        
        const pixel = this.collisionCtx.getImageData(Math.floor(checkX), Math.floor(checkY), 1, 1).data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        
        // Determine interaction type based on color
        if (r > 200 && g > 200 && b < 50) {
            return { type: 'yellow' }; // Yellow pixels = regular interaction
        } else if (r < 50 && g > 200 && b < 50) {
            return { type: 'green' }; // Green pixels = exit/special interaction
        } else if (r > 200 && g < 50 && b < 50) {
            return { type: 'red' }; // Red pixels = wall interaction
        } else {
            return { type: 'none' }; // No interaction
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 1. Draw background (school)
        if (this.backgroundImage && this.backgroundImage.complete) {
            const bgScale = 3;
            const bgWidth = this.backgroundImage.width * bgScale;
            const bgHeight = this.backgroundImage.height * bgScale;
            
            this.ctx.drawImage(
                this.backgroundImage,
                -this.camera.x, -this.camera.y,
                bgWidth, bgHeight
            );
        }
        
        // 2. Create array of characters to render and sort by Y position
        const characters = [
            {
                type: 'kris',
                x: this.player.x,
                y: this.player.y,
                sprite: this.loadedSprites[this.currentDirection]?.[this.animationFrame],
                width: this.player.width,
                height: this.player.height,
                scale: 1.5,
                fallbackColor: '#88ddff'
            },
            {
                type: 'susie',
                x: this.susie.x,
                y: this.susie.y,
                sprite: this.loadedSusieSprites[this.susie.direction]?.[this.susie.animationFrame],
                width: 32,
                height: 32,
                scale: 3,
                fallbackColor: '#dd88ff'
            }
        ];
        
        // Sort characters by Y position (top to bottom rendering)
        characters.sort((a, b) => a.y - b.y);
        
        // 3. Draw characters in order
        for (const character of characters) {
            const screenX = character.x - this.camera.x;
            const screenY = character.y - this.camera.y;
            
            if (character.sprite && character.sprite.complete) {
                const scaledWidth = character.sprite.width * character.scale;
                const scaledHeight = character.sprite.height * character.scale;
                
                this.ctx.drawImage(
                    character.sprite,
                    screenX - (scaledWidth - character.width) / 2,
                    screenY - (scaledHeight - character.height) / 2,
                    scaledWidth,
                    scaledHeight
                );
            } else {
                // Fallback rectangle
                this.ctx.fillStyle = character.fallbackColor;
                this.ctx.fillRect(screenX, screenY, character.width, character.height);
            }
        }
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    destroy() {
        // Clean up event listeners and resources
        this.closeWorldDialogue();
        this.removeDevOverlay();
        // Additional cleanup can be added here
    }
}