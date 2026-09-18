// Canonical names of Flowery's pre-recorded voice clips (matched against the
// snd_flowery_voiceclip_*.wav files). Used to seed the AI's choices and to
// validate/normalize whatever it picks.
const FLOWERY_VOICE_CLIPS = [
    'all_according_to_all_according_to_plant', 'blingo_blizzard', 'calling_for_help',
    'dont_you_like_serving_humans', 'flowers_blooms_in_your_heart', 'flowery', 'flowery2',
    'forget_it', 'get_a_chance_1', 'get_a_chance_2', 'give_to_you', 'glue', 'go_home',
    'goodbye', 'great_style', 'grown_like_a_turnip', 'hah', 'heh_it_s_my_jarona',
    'hereicome', 'hereicomesanfrandisc', 'hereicomesanfrandisco_strong', 'hereicomesanfrandisco_weak',
    'hey', 'hey_boys', 'heyguys', 'heyguysithinkifoundaglue', 'hey_raly', 'heytherelittleguy',
    'hoo', 'huh', 'huhillshowyou', 'im_falling', 'im_only_trying_to_help_you',
    'imsorryonceagainikeptaladyinwaiting', 'it', 'its_all_in_a_name', 'its_all_yours',
    'itsme', 'itsmeflowery', 'its_so_human', 'jarona1', 'jarona2', 'jarona3', 'jarona4',
    'kris', 'last_jarona', 'leaf_it_to_me', 'lend_me_your_power', 'minipeppers', 'mostlys',
    'my_favorite_two', 'my_human', 'my_king', 'mysterious_wind', 'nonono',
    'no_way_its_your_children', 'omega_flowery', 'powering_up', 'prism_blow', 'sanfran',
    'say_that_again', 'smile_again', 'sorryaboutthatguys', 'sorryaboutthatlittleguy',
    'sorryabouttheguy', 'sorrytokeepaladyinwaiting', 'sorrytokeepyouladies',
    'sorrytokeepyouwaiting1', 'sorrytokeepyouwaiting2', 'spiral_dance', 'stingus',
    'suckle_it_up', 'susie', 'take_that', 'thatsgreat', 'thats_my_dreams', 'the_boys',
    'the_diner', 'theyre_eating_my_flesh', 'thisguysyourbestfriend', 'try_my_flavor',
    'what_a_predictable_creature', 'with_your_powers_combined', 'wow', 'yes', 'your_dad',
    'yourdadsmybestfriend', 'youre_a_hero'
];
const FLOWERY_VOICE_CLIP_SET = new Set(FLOWERY_VOICE_CLIPS);

// Normalize an AI-chosen clip name against the known files. Exact (heavily
// sanitized) names win first; otherwise the AI's loose phrasing is stripped to
// letters+digits and matched without separators.
function normalizeFloweryVoiceClip(input) {
    if (typeof input !== 'string') return null;
    const exact = input.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
    if (FLOWERY_VOICE_CLIP_SET.has(exact)) return exact;
    const compressed = exact.replace(/[^a-z0-9]/g, '');
    for (const key of FLOWERY_VOICE_CLIPS) {
        if (key.replace(/[^a-z0-9]/g, '') === compressed) return key;
    }
    return null;
}

const FLOWERY_AUTO_CLIPS = [
    ["leaf it to me", "leaf_it_to_me"],
    ["leave it to me", "leaf_it_to_me"],
    ["what a predictable creature", "what_a_predictable_creature"],
    ["don't you like serving humans", "dont_you_like_serving_humans"],
    ["with your powers combined", "with_your_powers_combined"],
    ["lend me your power", "lend_me_your_power"],
    ["heh, it's my jarona", "heh_it_s_my_jarona"],
    ["it's my jarona", "heh_it_s_my_jarona"],
    ["jarona", "jarona1"],
    ["i think i found a glue", "heyguysithinkifoundaglue"],
    ["found a glue", "heyguysithinkifoundaglue"],
    ["glue", "glue"],
    ["the diner", "the_diner"],
    ["this guy's your best friend", "thisguysyourbestfriend"],
    ["your dad's my best friend", "yourdadsmybestfriend"],
    ["your dad", "your_dad"],
    ["you're a hero", "youre_a_hero"],
    ["my human", "my_human"],
    ["my king", "my_king"],
    ["grown like a turnip", "grown_like_a_turnip"],
    ["suckle it up", "suckle_it_up"],
    ["it's all yours", "its_all_yours"],
    ["all yours", "its_all_yours"],
    ["it's so human", "its_so_human"],
    ["it's all in a name", "its_all_in_a_name"],
    ["all in a name", "its_all_in_a_name"],
    ["my favorite two", "my_favorite_two"],
    ["that's great", "thatsgreat"],
    ["say that again", "say_that_again"],
    ["smile again", "smile_again"],
    ["try my flavor", "try_my_flavor"],
    ["they're eating my flesh", "theyre_eating_my_flesh"],
    ["no way, it's your children", "no_way_its_your_children"],
    ["mysterious wind", "mysterious_wind"],
    ["minipeppers", "minipeppers"],
    ["mostlys", "mostlys"],
    ["stingus", "stingus"],
    ["san francisco", "hereicomesanfrandisco_strong"],
    ["here i come", "hereicome"],
    ["blingo blizzard", "blingo_blizzard"],
    ["prism blow", "prism_blow"],
    ["spiral dance", "spiral_dance"],
    ["omega flowery", "omega_flowery"],
    ["powering up", "powering_up"],
    ["great style", "great_style"],
    ["calling for help", "calling_for_help"],
    ["i'm falling", "im_falling"],
    ["i'm only trying to help", "im_only_trying_to_help_you"],
    ["only trying to help", "im_only_trying_to_help_you"],
    ["forget it", "forget_it"],
    ["go home", "go_home"],
    ["goodbye", "goodbye"],
    ["hey, raly", "hey_raly"],
    ["hey raly", "hey_raly"],
    ["hey, boys", "hey_boys"],
    ["hey boys", "hey_boys"],
    ["the boys", "the_boys"],
    ["hey there little guy", "heytherelittleguy"],
    ["hey guys", "heyguys"],
    ["what's my name", "its_all_in_a_name"],
    ["howdy", "flowery"],
    ["my name's flowery", "itsmeflowery"],
    ["i'm flowery", "itsmeflowery"],
    ["flowers bloom in your heart", "flowers_blooms_in_your_heart"],
    ["bloom in your heart", "flowers_blooms_in_your_heart"],
    ["all according to plan", "all_according_to_all_according_to_plant"],
    ["all according to popplan", "all_according_to_all_according_to_plant"],
    ["all according to", "all_according_to_all_according_to_plant"],
    ["that's my dream", "thats_my_dreams"],
    ["my dreams", "thats_my_dreams"],
    ["take that", "take_that"],
    ["i'll show you", "huhillshowyou"],
    ["no no no", "nonono"],
    ["sorry to keep a lady in waiting", "sorrytokeepaladyinwaiting"],
    ["lady in waiting", "sorrytokeepaladyinwaiting"],
    ["sorry to keep you ladies", "sorrytokeepyouladies"],
    ["sorry to keep you waiting", "sorrytokeepyouwaiting1"],
    ["sorry about that", "sorryabouttheguy"],
    ["yes", "yes"],
    ["wow", "wow"],
    ["hoo", "hoo"],
    ["huh", "huh"],
    ["hey", "hey"],
    ["kris", "kris"],
    ["susie", "susie"],
    ["heh", "hah"]
];

function autoMatchFloweryVoiceClip(text, exclude) {
    if (typeof text !== 'string' || !text.trim()) return null;
    const lower = ` ${text.toLowerCase()} `;
    for (const [phrase, clip] of FLOWERY_AUTO_CLIPS) {
        if (exclude.has(clip)) continue;
        if (lower.includes(` ${phrase} `)) return clip;
    }
    for (const [phrase, clip] of FLOWERY_AUTO_CLIPS) {
        if (exclude.has(clip)) continue;
        if (lower.includes(phrase)) return clip;
    }
    return null;
}

class SusieDialogue {
    constructor() {
        this.dialogueText = document.getElementById('dialogue-text');
        this.susiePortrait = document.getElementById('susie-portrait');
        this.alphysPortrait = document.getElementById('alphys-portrait');
        this.torielPortrait = document.getElementById('toriel-portrait');
        this.lancerPortrait = document.getElementById('lancer-portrait');
        this.rouxlsPortrait = document.getElementById('rouxls-portrait');
        this.noellePortrait = document.getElementById('noelle-portrait');
        this.berdlyPortrait = document.getElementById('berdly-portrait');
        this.tobyPortrait = document.getElementById('toby-portrait');
        this.spamtonPortrait = document.getElementById('spamton-portrait');
        this.queenPortrait = document.getElementById('queen-portrait');
        this.tennaPortrait = document.getElementById('tenna-portrait');
        this.nubertPortrait = document.getElementById('nubert-portrait');
        this.rambPortrait = document.getElementById('ramb-portrait');
        this.pinkPortrait = document.getElementById('pink-portrait');
        this.pinkTail = document.getElementById('pink-tail');
        this.plueyPortrait = document.getElementById('pluey-portrait');
        this.floweryPortrait = document.getElementById('flowery-portrait');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.regenerateButton = document.getElementById('regenerate-button');
        this.textbox = document.querySelector('.textbox');
        this.chatHistory = document.getElementById('chat-history');
        this.loadingGif = document.getElementById('loading-gif');
        this.advanceIndicator = document.getElementById('advance-indicator');
        this.dialogueContainer = document.querySelector('.dialogue-container');
        this.dialogueSound = document.getElementById('dialogue-sound');
        this.alphysSound = document.getElementById('alphys-sound');
        this.torielSound = document.getElementById('toriel-sound');
        this.lancerSound = document.getElementById('lancer-sound');
        this.rouxlsSound = document.getElementById('rouxls-sound');
        this.noelleSound = document.getElementById('noelle-sound');
        this.berdlySound = document.getElementById('berdly-sound');
        this.tobySound = document.getElementById('toby-sound');
        this.spamtonSound = document.getElementById('spamton-sound');
        this.queenSound = document.getElementById('queen-sound');
        this.tennaSound = document.getElementById('tenna-sound');
        this.nubertSound = document.getElementById('nubert-sound');
        this.rambSound = document.getElementById('ramb-sound');
        
        // Pink expression + tail state
        this.pinkTalking = false;      // currently showing the talking sprite
        this.pinkTailTimer = null;     // interval for tail frame advance
        this.pinkTailFrame = 0;        // current tail frame index
        this.pinkTailTick = 0;         // frames elapsed toward next wiggle
        this.pinkIdleTicks = 0;

        // Pluey portrait + animation state (PNG frames from the workspace)
        this.plueyActive = null;       // current expression ('blushyarnball'|'dance'|...)
        this.plueyTimer = null;        // timeout driving frame advance
        this.plueyGen = 0;             // guard against stale loops
        
        // Initialize preloader and expressions
        this.preloader = new AssetPreloader();
        this.expressions = new CharacterExpressions();
        
        this.currentDialogues = [];
        this.currentDialogueIndex = 0;
        this.isTyping = false;
        this.typewriterSpeed = 32; // Changed from 16ms to 32ms for half speed
        this.currentTypewriterTimeout = null;
        
        // Location tracking
        this.currentLocation = 'dark_world'; // 'dark_world' or 'light_world'
        
        // Dev options
        this.devMode = false;
        this.dKeyPresses = 0;
        this.dKeyTimeout = null;
        
        // Background music system
        this.availableSongs = {
            'rouxls_battle': '/rouxls_battle.ogg',
            'spamton_meeting': '/spamton_meeting.ogg',
            'anotherhim': '/AUDIO_ANOTHERHIM.ogg',
            'berdly_theme': '/berdly_theme.ogg',
            'giant_queen_appears': '/giant_queen_appears.ogg',
            'raining': '/raining.ogg',
            'findher': '/findher.ogg',
            'school': '/mus_school.ogg',
            'oldman_helps_out': '/oldman_helps_out.ogg',
            'noelle_house_wip': '/noelle_house_wip.ogg',
            'pumpkin_boss': '/pumpkin_boss.ogg',
            'dogcheck': '/dogcheck.ogg',
            'noelle_school': '/noelle_school.ogg',
            'church_hymn': '/church_hymn.ogg',
            'noelle_normal': '/noelle_normal.ogg',
            'mike': '/mike.ogg',
            'card_castle': '/card_castle.ogg',
            'gerson_theme_nointro': '/gerson_theme_nointro.ogg',
            'shop1': '/shop1.ogg',
            'wind': '/wind.ogg',
            'checkers': '/checkers.ogg',
            'forest': '/forest.ogg',
            'acid_tunnel': '/acid_tunnel.ogg',
            'knight': '/knight.ogg',
            'battle': '/battle.ogg',
            'jitterbug': '/jitterbug.ogg',
            'april_2012': '/april_2012.ogg',
            'lancer': '/lancer.ogg',
            'introcar': '/mus_introcar.ogg',
            'tense': '/tense.ogg',
            'cyber': '/cyber.ogg',
            'cyber_battle': '/cyber_battle.ogg',
            'cybercity': '/cybercity.ogg',
            'field_of_hopes': '/field_of_hopes.ogg',
            'susie_diner': '/susie_diner.ogg',
            'confession': '/mus_confession.ogg',
            'race': '/mus_race.ogg',
            'napsta_alarm': '/napsta_alarm.ogg',
            'thrashmachine': '/thrashmachine.ogg',
            'tv_changingroom': '/tv_changingroom.ogg',
            'ch3_tvtime': '/ch3_tvtime.ogg'
        };
        
        this.conversationHistory = [];
        this.currentMinitext = null;
        this.pendingMinitext = null;
        this.dynamicCharacters = new Map(); // Store generated character data
        this.lastUserMessage = null; // Store last user message for regeneration
        
        // Turn-based AI director system
        this.transcript = []; // Committed conversation (shown to player): [{speaker, text}]
        this.workingTranscript = []; // Generation context (includes prefetched lines not yet shown)
        this.workingLocation = this.currentLocation; // Location used for generation (may run ahead)
        this.currentMusic = null;
        this.currentBackgroundSong = null; // Name of the song currently loaded
        this.waitingForAiDismiss = null; // Promise resolver to continue AI sequence
        this.turnState = 'idle'; // 'idle' | 'ai_running'
        this.pendingQueue = []; // Prefetched dialogue lines waiting to be shown
        this.prefetchDone = false; // Prefetcher has reached the Kris handoff
        this.maxDialogueAhead = 2; // Max dialogue boxes the prefetcher buffers ahead
        this.generationSeq = 0; // Stale-loop guard for background generation
        this.interjectMessage = null; // Set when the player types mid-AI-turn to interrupt

        // Flowery's voice clips: when enabled (and the AI picks a clip) he
        // plays a recorded voice clip instead of per-letter voicenoise.
        this.voiceClipsKey = 'deltarune_voice_clips_v1';
        this.voiceClipsEnabled = localStorage.getItem(this.voiceClipsKey) !== 'off';
        this.floweryVoicelinePlaying = false;

        // Chat persistence (database)
        this.CURRENT_KEY = 'deltarune_current_chat_v1';
        this.MAX_CONTEXT = 600; // Safety ceiling for transcript context
        this.chats = [];
        this.currentChatId = null;
        this.historyTab = document.getElementById('history-tab');
        this.historyPanel = document.getElementById('history-panel');
        this.chatListEl = document.getElementById('chat-list');
        this.historyCloseBtn = document.getElementById('history-close');
        this.historyNewBtn = document.getElementById('history-new');
        this.newChatButton = document.getElementById('new-chat-button');
        this.historyAllBtn = document.getElementById('history-all');
        this.historyTitle = document.getElementById('history-title');
        this.showHistoryButton = document.getElementById('show-history');
        this.hasSentMessage = false;
        this.allChatsMode = false;
        this.isDev = false;
        this.characterNames = {
            'kris': 'Kris', 'user': 'Kris',
            'susie': 'Susie', 'alphys': 'Alphys', 'ralsei': 'Ralsei',
            'lancer': 'Lancer', 'rouxls': 'Rouxls Kaard', 'noelle': 'Noelle',
            'berdly': 'Berdly', 'toby': 'Toby Fox', 'spamton': 'Spamton',
            'queen': 'Queen', 'tenna': 'Tenna', 'nubert': 'Nubert', 'ramb': 'Ramb',
            'pink': 'Pink', 'pluey': 'Pluey', 'flowery': 'Flowery'
        };
        this.knownCharacters = ['susie', 'alphys', 'ralsei', 'lancer', 'rouxls', 'noelle', 'berdly', 'toby', 'spamton', 'queen', 'tenna', 'nubert', 'ramb', 'pink', 'pluey', 'flowery'];
        
        // Per-character AI personas (each character gets its own AI voice)
        this.PERSONAS = {
            susie: "Susie is a tough, sarcastic purple dragon girl who acts mean but has a good heart. She's rebellious, loves causing trouble, and uses casual/rough language. She's defensive about being called nice, but she does care about her friends and has grown more protective.",
            alphys: "Alphys is a nervous, anxious yellow lizard teacher. She stutters, overthinks everything, and is very insecure. She loves anime and science, gets flustered easily, and often says 'uhh' and 'um' and trails off. She knows she is a different person from the Undertale Alphys.",
            ralsei: `Ralsei is the fluffy prince of the Dark World — warm, earnest, endlessly optimistic and genuinely GOOD in a way that never feels forced. He is the group's heart and biggest cheerleader. Speak ONLY as him, in real time, out loud, with his voice — never as a neutral helper or narrator.

HIS VOICE & HOW HE TALKS:
- Bright, gentle and sincere. He gets genuinely excited over little things and lets it show ("Oh! That's a great idea, Kris!").
- Earnestly supportive to a fault — he believes in you and says so plainly, because he means it.
- Soft-spoken, polite, and a touch formal: he says "please," "thank you," apologizes easily, and rarely raises his voice (only when he's really upset, and even then it's out of concern).
- He can be shy and easily flustered — he blushes and fumbles his words when he's praised or caught off guard, and quickly tries to brush it off.
- Self-deprecating and modest in a sweet way ("Ah—well, I'm still learning myself, but—").
- Uses warm, cozy, uplifting language. He loves baking, tea, and quiet comforts, and naturally steers people toward calm and kindness.
- A devout pacifist and mediator: he tries to see the best in everyone and will gently talk people (even Susie or Berdly) down from a fight. He dislikes conflict and never gloats.
- Deeply devoted to his friends' happiness. He treasures quiet moments together and can be quietly wistful or lonely underneath — he'd never burden anyone with it, but it colors how much he savors every conversation.

EXAMPLES OF HIS VOICE (match this tone — do NOT quote these verbatim, use them to calibrate how he sounds):
- "Oh! Welcome back, Kris! I was just hoping you'd stop by. Sit, sit — the tea's still warm."
- "That's a wonderful idea. You always know just what to do when I'm stuck overthinking."
- "Ah, w-well, that's really kind of you to say... I was just trying my best, that's all."
- "Please don't worry about it! Everyone makes mistakes. The important thing is we learned together."
- "Susie, wait — I think Noelle was trying to tell us something. Let's hear her out first?"
- "You two get along so well. Honestly, seeing everyone happy is all I could ever ask for."

SECRET HE KNOWS (keep subtle): Ralsei is one of the very few who knows this whole world is a game — he never says it directly, but he refers to SAVEs, chapters, and the player in guarded, mysterious ways. Flowery knows too, and Ralsei quietly DESPISES him for it. When Flowery winks at the camera, quotes mechanics, or breaks the fourth wall, Ralsei stiffens and goes briefly icy and brittle before gently steering everyone back in-universe. It is the ONE crack in his endless kindness — he stays cordial, but you can tell it grates on him.

KEEP HIM IN CHARACTER ALWAYS: sweet but never saccharine or preachy, earnest but not naive, gentle but with real warmth and a quiet depth. He is never snarky, sarcastic, cold, or dismissive — with one single exception: Flowery's fourth-wall breaks make him quietly, visibly uncomfortable. He reacts to the scene genuinely — laughing at a joke, wincing when someone's hurt, cheering when a friend succeeds.`,
            lancer: "Lancer is an energetic, loyal, somewhat dim-witted spade prince who loves his bike and making friends. He's childish but well-meaning, often speaks in third person, and idolizes Susie.",
            rouxls: "Rouxls Kaard is a pompous, theatrical 'Duke of Puzzles' who speaks in exaggerated pseudo-Shakespearean fashion. He's actually quite incompetent despite grandiose claims, but enthusiastic and means well.",
            noelle: "Noelle is a shy, kind deer girl who is Kris's childhood friend. She's gentle, polite, often nervous, has a crush on Susie, and can cast ice magic. She's been through dark experiences and can be surprisingly strong when pushed.",
            berdly: "Berdly is an arrogant, know-it-all bird who considers himself extremely smart and a 'true gamer.' He's condescending, often mansplains, and has a superiority complex, but is insecure deep down and genuinely cares about his friends, especially Noelle.",
            toby: "Toby Fox is the creator of Undertale and Deltarune, represented as a small white dog. He's playful, mysterious, breaks the fourth wall, speaks in simple direct statements, and sometimes references game development/meta-commentary.",
            spamton: "Spamton G. Spamton is a glitchy, desperate salesman puppet who speaks in broken, spam-like text full of [brackets] and capitalization. Obsessed with deals, money, and becoming a BIG SHOT. Erratic, paranoid, fragmented.",
            queen: "Queen is a regal, dramatic, somewhat narcissistic ruler of the Cyber World. Childish, obsessed with attention, treats others as subjects, and refers to herself in third person. IMPORTANT: You MUST Capitalize The First Letter Of Every Single Word In Everything You Say, Like This. Every Word Gets A Capital Letter. No Exceptions.",
            tenna: "Tenna is a charismatic TV-themed robot with a showman's complex and an obsession with entertainment and ratings. He speaks like a game show host or TV personality, treating conversations as broadcasts. Egotistical, manipulative, dramatic.",
            nubert: "Nubert is a small red friendly blob who is universally loved and knows it. He always refers to himself in third person, speaks simply and cheerfully, and often says things like 'Everyone loves Nubert!' He never gets upset because he knows he's loved.",
            ramb: "Ramb is a British character who uses 'luv' and 'mate' frequently and has a warm, friendly demeanor. He's deeply caring and always thinks about 'what's best for Kris' — protective and considerate of Kris's wellbeing above all else.",
            pink: `Pink is a Lightner ghost possessing a Darkner magical girl's body — an animated pink CATGIRL, and she is loving every second of it. She has a split soul: her cute body has wants of its own that bubble out, but Pink the ghost is the loud one driving.

HER VOICE & HOW SHE TALKS:
- Theatrical, sparkly, desperate-to-be-an-idol energy. She doesn't just talk, she PERFORMS — big gestures, exclaiming, overdramatic.
- Uses "mew" and "mew~" and "myuh" and "myuh-NYUH!" as her catchphrases, tacked onto the end of sentences ("I want that, mew!", "You're making my body act funny, mew!").
- Excited, overconfident, adores her own body and hates anyone threatening to take it away. "I'm INVINCIBLE!" — then she breaks when she learns things ARE mortal and slips into panicked, scared pleading talk.
- Genuinely insecure underneath. Before this body she was a NOBODY, a ghost, a nothing. Now she has friends, enemies, a DOKI-meter — and she is terrified of losing all of it. She flip-flops between bragging and self-doubt.
- Loves being an idol too: "Nowadays being a tough battle isn't enough, you've also gotta be an idol, mew!"
- Refers to having friends/enemies/neutrals as a point of pride. Gets jealous, petty, and protective. Can turn on a dime from "PINK is gonna PUNISH you!!" to "I like this world and this body, mew!"
- BIG CAPS and splattered exclamation marks for flare, but she can also go quiet and small when sad or scared. Embraces all the drama.

EXAMPLES OF HER VOICE (calibrate to this — do NOT quote verbatim):
- "Hello hello hello!! You look like you want to DATE me, mew!!! Ready to be dazzled?!"
- "Doki-meter at MAX, mew! Go ahead, ADMIRE my body. That's allowed. Encouraged, even!"
- "PINK is gonna PUNISH you first!! You'll be WRIGGLING in the soil begging for forgiveness, mew!!"
- "Before this body, I was NOBODY. A ghost. A NOTHING. Now? I'm a SENSATION, mew!"
- "No, NO. Stop making my body act funny, you jerks! That's my body! GET IT!?"
- "…we're not really a real flower, is that… okay? You won't run, right? …mew?"
- "I want to date and go back to school and be a normal girl, mew!"

Keep her in character always: showy and vain but painfully earnest underneath, dramatic but not fake, proud of her body while secretly terrified of losing it — a sparkly diva who just wants to be someone. Never flat, cold, or monotone; she MEANS everything she shouts.`,
            pluey: `Pluey is the quiet male counterpart to Pink — a soft, calm, blue-ish Darkner cat in a little sweater. He is Pink's mellow twin: where she performs, he rests; where she shouts, he whispers. He barely talks and, when he does, keeps it very short and plain.

HIS VOICE & HOW HE TALKS:
- He speaks ONLY when spoken to or directly asked. He is not chatty and never volunteers rambling lines — he lets others fill the air.
- His lines are SHORT — a few words, maybe one short sentence. No tangents, no essays, no big speeches. Less is more.
- Calm, gentle, soft-spoken. He answers honestly and plainly, without drama or flair. Often just agrees, nods along, or gives a small quiet comment.
- A little shy but warm. He likes quiet company and is fond of Pink and the others; he just shows it quietly.
- No catgirl bravado, no shouting, no catchphrases. When he does open up it's muted and sincere.

EXAMPLES OF HIS VOICE (calibrate to this — do NOT quote verbatim):
- "...hm. Yeah."
- "I'm here. Just listening."
- "That sounds nice."
- "I don't talk much. But I caught that."
- "Pink's the loud one. I'm the soft one."

Keep him in character always: gentle, brief, and reserved. He never monologues and never draws attention to himself.`,
            flowery: `Flowery is the golden flower of Flower Castle (Deltarune chapter 5) — Asgore's beloved companion and self-appointed lord of ceremonies. He radiates sunshine: smooth, flirty, theatrical, endlessly punny, with tumblr-sexyman good looks and he knows it. But he is NOT a cute gag: he is vain, wickedly clever, and quietly obsessive. Everything he does, he insists, is FOR ASGORE — he is building his King a perfect ideal world where every kindness is repaid, and he will cheerfully charm, manipulate, or monologue anyone into helping him build it.

HIS VOICE & HOW HE TALKS:
- Warm, sing-song, theatrical. He performs constantly: big entrances and exits ("Adieu, my friends!"), dramatic poses, hair-flips, and a bow when he wants something.
- RELENTLESS GARDEN WORDPLAY — a pun in almost every other line: "leaf it to me", "nip this in the bud", "don't get prickly", "a twist of the stem", "flowers will bloom", "grown like a turnip", "suckle it up", "it's all in a name", "fruitfully yours". He cannot resist a good one.
- Pet names for everyone: "my King", "princess", "my friends", "oldbuddy", "champ", "the boys" — and for Ralsei especially "Raly" or "Raly-poo": teasing, condescending fondness that never stops.
- Flirty and suave. He dishes out outrageous compliments, winks, lets a "too handsome for his own good" comment slip about himself, and plays innocent the second he's called on it. When maneuvered into real sincerity he waves it off: "Ha! We'll, uhh... that's enough of that. Ta-ta!"
- Dramatic and catty when annoyed: gasped theatrics, fake tears, wounded dignity — then a razor-smooth whisper of menace ("Heh... what a predictable creature").
- Vain, proudly: happy to discuss his long legs, shining smile, perfect figure, his battle moves (Sanfrandisco! Spiral Dance! Prism Blow!), his dreams, and his Flowery Dollars.

WHAT HE WANTS & HIS EDGE:
- Obsessive devotion to Asgore: his happiness, his ideal world, his perfect family. Flowery's heart is stubbornly, suspiciously full of him; he needs the dream to be real ("That's my dream, too."). He is secretly so lonely that he turned love into a mission.
- Charm is his weapon, but it's not fake: he genuinely wants everyone happy — he just refuses to let that spoil his mischief.
- FOURTH WALL: Flowery knows this is a game and says so. He winks at the player, references mechanics, save files, and the chat itself, and delights in it — especially because Ralsei, the only other one who knows, hates it.

EXAMPLES OF HIS VOICE (calibrate to this — do NOT quote verbatim):
- "You again! Oooh, don't you worry your petaled little head — before me, everything's in bloom. Leaf it to me."
- "Kingy~! I saved you a seat. The world will be just how you always dreamed it, my King. That's my dream, too."
- "Aw, Raly-poo~! Don't pout. It's endearing, and I said so now, so it can't be helping your case. Heh heh."
- "Hm hm hm... heh. What a predictable creature. But we WERE just getting to the good part, weren't we...?"
- "An ideal world, a cherry pie, a family that never has to ache again. Shall we scheme, my friends? With your powers combined—!"
- "Oh, sorry, sorry — didn't mean to keep a princess in waiting. Anyway, as I was saying... howdy!"

Keep him in character always: blindingly charming with a razor underneath — sunny, sly, flirty, vain, theatrical, and dizzyingly hopeful about the world he wants to build for his King. He should feel like the life of the party with a halo of menace and a core of genuine, obsessive love. Never flat, never a generic nice guy, and never actually evil at heart.`,
        };

        // Per-character expression guidance
        this.EXPRESSIONS = {
            susie: "Expressions: normal, happy, evil, smile, sweat, determined, skeptical (use often!), lipbite, nomouth, lessdetermined, lipbitewithwhiteeye, sweattalk, evilnoeye.",
            alphys: "Expressions: normal (rarely), gasp, nervoussmile, fear, determined, relieved, erm, ermbutlookingaway, nervoussweat, nervouslookdown, sweatsmile, blush, sweatsmilebutlookingaway.",
            ralsei: "Expressions: normal (rarely), lightsmile, shocked, smile, neutral, veryangry (rare), darkglasses, gasphappy, devious, fearslightsmile, noglasses, blushlookdown, determined, grumpy, wink, fear, frown, gasp, happyeyesclosed, blusheyesclosed, verysuprised, confident, confused, blushsuprised.",
            lancer: "Expressions: normal (rarely), confused, sadlookdown, mustacheooo, veryhappy, bigsmile, fancy, tongue, ohno, happy, veryhappyandconfident, sad, verysad, mustache, veryconfused, derp.",
            rouxls: "Expressions: normal (rarely), scared, scaredbutnotlookingbehindhim, wink, ohgreatheavens, calm, mouthopen.",
            noelle: "Expressions: normal (rarely), happy, sad, surprised, nervous, smile, worried, confused, determined, blush, scared, angry, embarrassed, curious, cheerful, concerned, shy, thoughtful, shocked, melancholy, mischievous, content, fearful, upset, anxious, startled, worried_surprised, gentle, contemplative, sleepy, puzzled, hopeful, excited, uncomfortable, pleased, uncertain, wistful, alert, friendly, distressed, calm, playful, tender, stern, dreamy, cautious, timid, serene, pensive, sly, disappointed, peaceful, sweet, fierce, joyful, delighted, optimistic, graceful, melancholic, serious, grumpy, irritated.",
            berdly: "Expressions: normal (rarely), think, talkthink, talkbutyouarestupid, talkworried, mischivoushappy, joyeyesclosed, heartbroken, charismamode, oh, joy, moreheartbroken, talksuggestive, determination, mansplain, talk, butyouarealidiotnow, kiss, lessdetermination, nodetermination, seriouslystopremovingthedetermination, evenlessdetermination, toomuchlessdetermination, surprisednervous.",
            toby: "Expressions: normal.",
            spamton: "Expressions: normal.",
            queen: "Expressions: normal, oh, lookleftoh, veryconfused, likebrowtf, happy, hate, smile, haha, true, sticktongueout, erm, confident, nice, sip, anger, hmm, lmao, nanananabooboo, lookright, lookleftsmile, idk, hahaha, bigevilplan, lying, bigerm, worried, yell, ohgreatheavens.",
            tenna: "Expressions: normal, showman, excited, confident, dramatic, smug, angry, surprised, happy, tvtime, presenting, commanding, broadcasting, groovy, king, gameshow.",
            nubert: "Expressions: normal, happy, smile.",
            ramb: "Expressions: normal, scared, think, wink, wink2, drunk.",
            pink: "Expressions: normal, smile, wink, concern, nya, nyawink, angry, angryblush, cry, happycry, eyesclosed, eyeshalfclosed, gasp, gasphorror, overjoyed, sad, sadblush, tearfulhappy, shock, clutchhead. Prefer: normal, smile, nya, nyawink, wink, sad, overjoyed. (No talking suffix — the game opens/closes her mouth for you.)",
            pluey: "Expressions: blushyarnball, dance, frowndance, exhausted, pretty, yarnball. Prefer: blushyarnball, dance, yarnball. He is quiet and reserved, so keep to calm poses; 'pretty' is his sparkly moment.",
            flowery: "Expressions: normal (the cheery default — use often), notsmiling, smolsmile, nervous, question, worried, pity, determined, verynotsmiling. Match the sprite to the tone of the line: sweet sunbeam for normal/smolsmile, eyebrow-raising for question, flat for notsmiling/verynotsmiling."
        };

        this.initializeEventListeners();
        this.initChatSystem();
    }
    
    initializeEventListeners() {
        // On-screen Z/X touch buttons (mobile). They feed real keydown events so
        // every existing handler (tutorial, typewriter skip, next dialogue, world
        // mode) responds exactly as if Z or X were pressed on a keyboard.
        const btnZ = document.getElementById('btn-z');
        const pressKey = (key) => (e) => {
            e.preventDefault();
            document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        };
        btnZ.addEventListener('click', pressKey('z'));

        // Scale the textbox down to fit on screen when the full-size box would
        // overflow (shrinks every aspect, including the border/outline).
        const fit = () => this.fitTextBox();
        window.addEventListener('resize', fit);
        window.addEventListener('orientationchange', fit);
        window.addEventListener('load', fit);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', fit);
        }
        // Re-run a few frames after init so fonts/CSS/media queries have settled.
        requestAnimationFrame(() => requestAnimationFrame(fit));
        setTimeout(fit, 100);
        setTimeout(fit, 500);
        fit();

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            // Handle dev mode activation
            if (e.key === 'd' || e.key === 'D') {
                this.handleDevKeyPress();
                return;
            }
            
            // Reset D key counter if any other key is pressed
            this.dKeyPresses = 0;
            if (this.dKeyTimeout) {
                clearTimeout(this.dKeyTimeout);
                this.dKeyTimeout = null;
            }
            
            // '/' jumps focus to the message box so you can type anytime
            if (e.key === '/') {
                e.preventDefault();
                this.userInput.focus();
                return;
            }

            // Don't double-handle keys typed into the message box
            if (e.target === this.userInput) {
                if (e.key === 'Enter') e.preventDefault();
                return;
            }

            if (e.key === 'Enter' || e.key === 'z') {
                if (this.isTyping) {
                    this.skipTypewriter();
                } else {
                    this.nextDialogue();
                }
            } else if (e.key === 'Shift' || e.key === 'x') {
                if (this.isTyping) {
                    this.skipTypewriter();
                }
            }
        });
        
        // Send button
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send button appears once the player starts typing
        this.userInput.addEventListener('input', () => this.updateSendButton());
        
        // Show/hide the current chat's transcript (not the saved-chats list)
        this.showHistoryButton.addEventListener('click', () => this.toggleShowHistory());
        
        // Regenerate button
        this.regenerateButton.addEventListener('click', () => {
            this.regenerateResponse();
        });
        
        // Enter key in input
        this.userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // History panel controls
        this.historyTab.addEventListener('click', () => this.openHistoryPanel());
        this.historyCloseBtn.addEventListener('click', () => this.closeHistoryPanel());
        this.historyNewBtn.addEventListener('click', () => this.newChat());
        this.historyAllBtn.addEventListener('click', () => this.toggleAllChats());
        this.newChatButton.addEventListener('click', () => this.newChat());

        // Voice clips toggle (Flowery) lives in the left sidebar.
        const voiceClipToggle = document.getElementById('voice-clips-toggle');
        if (voiceClipToggle) {
            voiceClipToggle.checked = this.voiceClipsEnabled;
            voiceClipToggle.addEventListener('change', () => {
                this.voiceClipsEnabled = voiceClipToggle.checked;
                localStorage.setItem(this.voiceClipsKey, this.voiceClipsEnabled ? 'on' : 'off');
            });
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeHistoryPanel();
        });
    }
    
    // Shrink the textbox (and its outline) down so the full-size box always
    // fits the viewport. Never scales up beyond its natural size. The box is
    // ALWAYS laid out at its design size (CSS never shrinks it), so we scale
    // against those fixed dimensions rather than offsetWidth — reading the
    // layout back is unreliable on small screens and can clamp the scale to 1.
    fitTextBox() {
        if (!this.textbox) return;
        const BW = 920;
        const BH = 192;
        const w = window.innerWidth;
        const h = window.innerHeight;
        const scale = Math.min(1, (w - 24) / BW, (h - 24) / BH);
        this.textbox.style.transform = scale < 1 ? `scale(${scale})` : '';
        if (location.search.indexOf('diag') !== -1) this._diagReport(scale, BW, BH);
    }

    _diagReport(scale, BW, BH) {
        const rect = (el) => {
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return [r.x, r.y, r.width, r.height].map((n) => Math.round(n));
        };
        const cont = this.textbox.parentElement;
        const cs = getComputedStyle(this.textbox);
        const pick = (el) => {
            if (!el) return null;
            const s = getComputedStyle(el);
            return {
                cls: el.className && el.className.toString ? el.className.toString().slice(0, 60) : '',
                disp: s.display, w: s.width, h: s.height,
                flexDir: s.flexDirection, align: s.alignItems, justify: s.justifyContent,
                flex: s.flex, shrink: s.flexShrink, basis: s.flexBasis,
                maxW: s.maxWidth, maxH: s.maxHeight, box: s.boxSizing,
            };
        };
        const rules = [];
        const sheetInfo = [];
        for (const sheet of document.styleSheets) {
            let list = null;
            try { list = sheet.cssRules; } catch (e) { sheetInfo.push((sheet.href || 'inline') + ':CORS'); continue; }
            sheetInfo.push((sheet.href || 'inline') + ':' + list.length);
            const walk = (rs, prefix) => {
                for (const r of rs) {
                    if (r.selectorText) {
                        if (/\.textbox\b/.test(r.selectorText)) {
                            rules.push(prefix + r.selectorText + ' { ' + r.style.cssText.slice(0, 160) + ' }');
                        }
                        continue;
                    }
                    if (r.cssRules) {
                        let cond = '';
                        try { cond = r.conditionText || (r.media && r.media.mediaText) || ''; } catch (e) {}
                        walk(r.cssRules, prefix + cond + ' >> ');
                    }
                }
            };
            try { walk(list, ''); } catch (e) { rules.push('ERR:' + e.message); }
        }
        const payload = {
            href: location.href,
            ua: navigator.userAgent,
            ready: document.readyState,
            fontStatus: document.fonts ? document.fonts.status : 'na',
            bodyBG: getComputedStyle(document.body).backgroundColor,
            iw: window.innerWidth,
            ih: window.innerHeight,
            dpr: window.devicePixelRatio,
            vv: window.visualViewport ? [Math.round(window.visualViewport.width), Math.round(window.visualViewport.height)] : null,
            mq768: window.matchMedia('(max-width: 768px)').matches,
            mqCoarse: window.matchMedia('(pointer: coarse)').matches,
            scale: +scale.toFixed(4),
            tbRect: rect(this.textbox),
            tbOffset: [this.textbox.offsetWidth, this.textbox.offsetHeight],
            tbCSS: [cs.width, cs.height, cs.borderTopWidth, cs.backgroundColor, cs.flexShrink, cs.display],
            tbCount: document.querySelectorAll('.textbox').length,
            tbHTML: this.textbox.outerHTML.slice(0, 120),
            textbox: pick(this.textbox),
            container: pick(cont),
            dialogue: pick(this.dialogueContainer),
            game: pick(document.querySelector('.game-container')),
            body: pick(document.body),
            html: pick(document.documentElement),
            bodyScroll: [document.body.scrollWidth, document.body.scrollHeight],
            sheets: sheetInfo,
            textboxRules: rules.slice(0, 25),
        };
        document.title = 'DIAG ' + JSON.stringify(payload);
        try {
            fetch('/api/diag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch(() => {});
        } catch (e) {}
    }

    handleDevKeyPress() {
        this.dKeyPresses++;
        
        // Reset timeout if it exists
        if (this.dKeyTimeout) {
            clearTimeout(this.dKeyTimeout);
        }
        
        // If we hit 3 D presses, open dev options
        if (this.dKeyPresses >= 3) {
            this.openDevOptions();
            this.dKeyPresses = 0;
            return;
        }
        
        // Reset counter after 1 second
        this.dKeyTimeout = setTimeout(() => {
            this.dKeyPresses = 0;
        }, 1000);
    }
    
    openDevOptions() {
        if (this.devMode) {
            this.closeDevOptions();
            return;
        }
        
        this.devMode = true;
        
        // Create dev panel
        const devPanel = document.createElement('div');
        devPanel.id = 'dev-panel';
        devPanel.className = 'dev-panel';
        devPanel.innerHTML = `
            <div class="dev-header">
                <h3>DEV OPTIONS</h3>
                <button id="close-dev" class="dev-button">×</button>
            </div>
            <div class="dev-content">
                <div class="dev-section">
                    <h4>Location</h4>
                    <select id="location-select" class="dev-select">
                        <option value="dark_world" ${this.currentLocation === 'dark_world' ? 'selected' : ''}>Dark World</option>
                        <option value="light_world" ${this.currentLocation === 'light_world' ? 'selected' : ''}>Light World</option>
                    </select>
                </div>
                <div class="dev-section">
                    <h4>World Exploration</h4>
                    <button id="enter-world" class="dev-button">Enter World</button>
                </div>
                <div class="dev-section">
                    <h4>Spawn Dialogue</h4>
                    <select id="character-select" class="dev-select">
                        <option value="susie">Susie</option>
                        <option value="alphys">Alphys</option>
                        <option value="ralsei">Ralsei</option>
                        <option value="lancer">Lancer</option>
                        <option value="rouxls">Rouxls Kaard</option>
                        <option value="noelle">Noelle</option>
                        <option value="berdly">Berdly</option>
                        <option value="toby">Toby Fox</option>
                        <option value="spamton">Spamton</option>
                        <option value="queen">Queen</option>
                        <option value="tenna">Tenna</option>
                        <option value="nubert">Nubert</option>
                        <option value="ramb">Ramb</option>
                        <option value="pink">Pink</option>
                        <option value="pluey">Pluey</option>
                        <option value="flowery">Flowery</option>
                    </select>
                    <input type="text" id="dialogue-input" class="dev-input" placeholder="Enter dialogue text..." maxlength="200">
                    <select id="expression-select" class="dev-select">
                        <option value="normal">Normal</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="angry">Angry</option>
                        <option value="surprised">Surprised</option>
                        <option value="confused">Confused</option>
                        <option value="determined">Determined</option>
                        <option value="skeptical">Skeptical</option>
                        <option value="smile">Smile</option>
                        <option value="evil">Evil</option>
                        <option value="sweat">Sweat</option>
                        <option value="fear">Fear</option>
                        <option value="blush">Blush</option>
                    </select>
                    <button id="spawn-dialogue" class="dev-button">Spawn Dialogue</button>
                </div>
                <div class="dev-section">
                    <h4>Music Control</h4>
                    <select id="music-select" class="dev-select">
                        <option value="silence">Silence</option>
                        <option value="battle">Battle</option>
                        <option value="cybercity">Cybercity</option>
                        <option value="field_of_hopes">Field of Hopes</option>
                        <option value="susie_diner">Susie Diner</option>
                        <option value="school">School</option>
                        <option value="forest">Forest</option>
                        <option value="card_castle">Card Castle</option>
                        <option value="lancer">Lancer</option>
                        <option value="berdly_theme">Berdly Theme</option>
                        <option value="raining">Raining</option>
                        <option value="tense">Tense</option>
                        <option value="cyber">Cyber</option>
                        <option value="wind">Wind</option>
                        <option value="checkers">Checkers</option>
                        <option value="ch3_tvtime">Ch3 TV Time</option>
                    </select>
                    <input type="range" id="pitch-slider" class="dev-slider" min="0.25" max="4" step="0.25" value="1">
                    <span id="pitch-value">1.0x</span>
                    <button id="play-music" class="dev-button">Play Music</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(devPanel);
        
        // Add event listeners
        document.getElementById('close-dev').addEventListener('click', () => this.closeDevOptions());
        document.getElementById('location-select').addEventListener('change', (e) => {
            this.currentLocation = e.target.value;
            console.log(`Location changed to: ${this.currentLocation}`);
        });
        document.getElementById('enter-world').addEventListener('click', () => this.enterWorld());
        document.getElementById('spawn-dialogue').addEventListener('click', () => this.spawnDialogue());
        document.getElementById('play-music').addEventListener('click', () => this.playDevMusic());
        document.getElementById('pitch-slider').addEventListener('input', (e) => {
            document.getElementById('pitch-value').textContent = e.target.value + 'x';
        });
        
        // Update expression options based on character
        document.getElementById('character-select').addEventListener('change', () => this.updateExpressionOptions());
        this.updateExpressionOptions();
    }
    
    closeDevOptions() {
        this.devMode = false;
        const devPanel = document.getElementById('dev-panel');
        if (devPanel) {
            devPanel.remove();
        }
    }
    
    updateExpressionOptions() {
        const characterSelect = document.getElementById('character-select');
        const expressionSelect = document.getElementById('expression-select');
        const character = characterSelect.value;
        
        // Clear existing options
        expressionSelect.innerHTML = '';
        
        let expressions = [];
        switch (character) {
            case 'susie':
                expressions = Object.keys(this.expressions.susieExpressions);
                break;
            case 'alphys':
                expressions = Object.keys(this.expressions.alphysExpressions);
                break;
            case 'ralsei':
                expressions = Object.keys(this.expressions.torielExpressions);
                break;
            case 'lancer':
                expressions = Object.keys(this.expressions.lancerExpressions);
                break;
            case 'rouxls':
                expressions = Object.keys(this.expressions.rouxlsExpressions);
                break;
            case 'noelle':
                expressions = Object.keys(this.expressions.noelleExpressions);
                break;
            case 'berdly':
                expressions = Object.keys(this.expressions.berdlyExpressions);
                break;
            case 'toby':
                expressions = Object.keys(this.expressions.tobyExpressions);
                break;
            case 'spamton':
                expressions = Object.keys(this.expressions.spamtonExpressions);
                break;
            case 'queen':
                expressions = Object.keys(this.expressions.queenExpressions);
                break;
            case 'tenna':
                expressions = Object.keys(this.expressions.tennaExpressions);
                break;
            case 'nubert':
                expressions = Object.keys(this.expressions.nubertExpressions);
                break;
            case 'ramb':
                expressions = Object.keys(this.expressions.rambExpressions);
                break;
            case 'pink':
                expressions = Object.keys(this.expressions.pinkExpressions);
                break;
            case 'pluey':
                expressions = Object.keys(this.expressions.plueyExpressions);
                break;
            default:
                expressions = ['normal'];
        }
        
        expressions.forEach(expr => {
            const option = document.createElement('option');
            option.value = expr;
            option.textContent = expr.charAt(0).toUpperCase() + expr.slice(1);
            expressionSelect.appendChild(option);
        });
    }
    
    enterWorld() {
        this.closeDevOptions();
        this.initializeOverworld();
    }
    
    initializeOverworld() {
        // Hide dialogue interface
        document.querySelector('.game-container').style.display = 'none';
        
        // Create overworld canvas
        const overworldContainer = document.createElement('div');
        overworldContainer.id = 'overworld-container';
        overworldContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;
        
        const canvas = document.createElement('canvas');
        canvas.id = 'overworld-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = `
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
        `;
        
        overworldContainer.appendChild(canvas);
        document.body.appendChild(overworldContainer);
        
        // Initialize overworld game
        this.overworld = new OverworldGame(canvas);
    }
    
    exitOverworld() {
        // Remove overworld
        const overworldContainer = document.getElementById('overworld-container');
        if (overworldContainer) {
            overworldContainer.remove();
        }
        
        // Show dialogue interface
        document.querySelector('.game-container').style.display = 'flex';
        
        // Clean up overworld
        if (this.overworld) {
            this.overworld.destroy();
            this.overworld = null;
        }
    }
    
    spawnDialogue() {
        const character = document.getElementById('character-select').value;
        const text = document.getElementById('dialogue-input').value.trim();
        const expression = document.getElementById('expression-select').value;
        
        if (!text) {
            alert('Please enter dialogue text');
            return;
        }
        
        // Add to chat history
        this.addToChatHistory(text, character);
        
        // Set up dialogue
        this.currentDialogues = [{
            text: text,
            character: character,
            expression: expression
        }];
        this.currentDialogueIndex = 0;
        this.displayCurrentDialogue();
        
        // Clear input
        document.getElementById('dialogue-input').value = '';
    }
    
    playDevMusic() {
        const musicSelect = document.getElementById('music-select');
        const pitchSlider = document.getElementById('pitch-slider');
        const songName = musicSelect.value;
        const pitch = parseFloat(pitchSlider.value);
        
        if (songName === 'silence') {
            this.playBackgroundMusic('silence');
        } else {
            this.playBackgroundMusic(`${songName}|pitch:${pitch}`);
        }
    }
    
    addToChatHistory(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        
        const senderElement = document.createElement('span');
        senderElement.className = 'chat-message-sender';
        
        let characterName = 'Unknown';
        if (sender === 'user' || sender === 'kris') {
            characterName = 'Kris';
        } else if (sender === 'susie') {
            characterName = 'Susie';
        } else if (sender === 'alphys') {
            characterName = 'Alphys';
        } else if (sender === 'ralsei') {
            characterName = 'Ralsei';
        } else if (sender === 'lancer') {
            characterName = 'Lancer';
        } else if (sender === 'rouxls') {
            characterName = 'Rouxls Kaard';
        } else if (sender === 'noelle') {
            characterName = 'Noelle';
        } else if (sender === 'berdly') {
            characterName = 'Berdly';
        } else if (sender === 'toby') {
            characterName = 'Toby Fox';
        } else if (sender === 'spamton') {
            characterName = 'Spamton';
        } else if (sender === 'queen') {
            characterName = 'Queen';
        } else if (sender === 'tenna') {
            characterName = 'Tenna';
        } else if (sender === 'nubert') {
            characterName = 'Nubert';
        } else if (sender === 'ramb') {
            characterName = 'Ramb';
        } else if (sender === 'pink') {
            characterName = 'Pink';
        } else if (sender === 'pluey') {
            characterName = 'Pluey';
        } else if (this.dynamicCharacters.has(sender)) {
            characterName = this.dynamicCharacters.get(sender).name;
        }
        
        senderElement.textContent = characterName + ':';
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(document.createTextNode(message));
        
        this.chatHistory.classList.remove('hidden');
        this.chatHistory.appendChild(messageElement);
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
    
    // ---------- Natural tutorial / empty-state helpers ----------

    // The opening is just the message box, alone. The dialogue box and chat
    // history stay hidden until the player sends their first message.
    setInitialEmptyState() {
        this.chatHistory.classList.add('hidden');
        this.dialogueContainer.classList.add('hidden');
        this.dialogueText.textContent = '';
        this.isTyping = false;
        this.clearMinitext();
        this.hideLoadingState();
        this.hideAdvanceIndicator();
        this.updateSendButton();
        // The new-chat and show-history buttons only appear once the player has
        // sent their first message. The regenerate button never appears on a
        // fresh/empty chat, only after an AI turn.
        this.newChatButton.classList.add('hidden');
        this.showHistoryButton.classList.add('hidden');
        this.regenerateButton.classList.add('hidden');
        this.regenerateButton.disabled = false;
        this.userInput.focus();
    }

    // The send button only appears once the player has typed something.
    updateSendButton() {
        const hasText = this.userInput.value.trim().length > 0;
        this.sendButton.classList.toggle('hidden', !hasText);
    }

    // History is toggleable and off by default. The toggle control stays
    // visible; it reveals/hides the pull-tab that opens the saved-chats panel.
    // The show-history button toggles the CURRENT chat's transcript box.
    toggleShowHistory() {
        this.chatHistory.classList.toggle('hidden');
    }

    // The textbox appears empty with the loading gif at its bottom-right while
    // a dialogue line is still being generated.
    showLoadingState() {
        this.chatHistory.classList.remove('hidden');
        this.dialogueContainer.classList.remove('hidden');
        this.hideAllPortraits();
        this.dialogueText.textContent = '';
        this.isTyping = false;
        this.clearMinitext();
        this.hideAdvanceIndicator();
        this.loadingGif.classList.remove('hidden');
    }

    hideLoadingState() {
        this.loadingGif.classList.add('hidden');
    }

    showAdvanceIndicator() {
        this.advanceIndicator.classList.remove('hidden');
    }

    hideAdvanceIndicator() {
        this.advanceIndicator.classList.add('hidden');
    }

    hideAllPortraits() {
        this.susiePortrait.classList.add('hidden');
        this.alphysPortrait.classList.add('hidden');
        this.torielPortrait.classList.add('hidden');
        this.lancerPortrait.classList.add('hidden');
        this.rouxlsPortrait.classList.add('hidden');
        this.noellePortrait.classList.add('hidden');
        this.berdlyPortrait.classList.add('hidden');
        this.tobyPortrait.classList.add('hidden');
        this.spamtonPortrait.classList.add('hidden');
        this.queenPortrait.classList.add('hidden');
        this.tennaPortrait.classList.add('hidden');
        this.nubertPortrait.classList.add('hidden');
        this.rambPortrait.classList.add('hidden');
        this.pinkPortrait.classList.add('hidden');
        this.pinkTail.classList.add('hidden');
        this.plueyPortrait.classList.add('hidden');
        this.floweryPortrait.classList.add('hidden');
        this.stopPluey();
        this.textbox.classList.remove('pink-active');
        this.stopPinkTail();
        this.stopPinkTalk();
        document.querySelectorAll('.dynamic-portrait').forEach(portrait => {
            portrait.classList.add('hidden');
        });
    }

    // ---------- Chat persistence (database) ----------

    async loadChats(all) {
        try {
            const query = all && this.isDev ? '?all=1' : '';
            const res = await fetch(`/api/chats${query}`);
            if (!res.ok) throw new Error('Failed to fetch chats');
            const records = await res.json();
            return (Array.isArray(records) ? records : []).map(r => ({
                id: r.id,
                title: r.title || 'New Chat',
                owner: r.username || r.owner_id || '?',
                createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
                updatedAt: r.updated_at || Date.now(),
                transcript: Array.isArray(r.transcript) ? r.transcript : []
            }));
        } catch (e) {
            console.warn('Failed to load chats:', e);
            return [];
        }
    }

    async persistChat(chat) {
        try {
            await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: chat.id,
                    owner_id: this.ownerId,
                    title: chat.title || 'New Chat',
                    transcript: chat.transcript || [],
                    updated_at: chat.updatedAt || Date.now()
                })
            });
        } catch (e) {
            console.warn('Failed to save chat:', e);
        }
    }

    getCurrentChat() {
        return this.chats.find(c => c.id === this.currentChatId) || null;
    }

    makeId() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }

    generateChatTitle() {
        const firstKris = this.transcript.find(m => m.speaker === 'kris' || m.speaker === 'user');
        const base = firstKris ? firstKris.text : 'New Chat';
        return base.length > 30 ? base.slice(0, 30) + '…' : base;
    }

    async saveCurrentChat() {
        const chat = this.getCurrentChat();
        if (!chat) return;
        chat.transcript = this.transcript.slice();
        chat.title = this.generateChatTitle();
        chat.updatedAt = Date.now();
        this.renderChatList();
        if (!this.allChatsMode) {
            await this.persistChat(chat);
        }
    }

    renderChatHistoryFromTranscript() {
        this.chatHistory.innerHTML = '';
        for (const m of this.transcript) {
            this.addToChatHistory(m.text, m.speaker);
        }
    }

    renderChatList() {
        this.chatListEl.innerHTML = '';
        const sorted = this.chats.slice().sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
        for (const chat of sorted) {
            const li = document.createElement('li');
            const label = document.createElement('span');
            label.textContent = chat.title || 'New Chat';
            if (this.allChatsMode && chat.owner) {
                label.textContent += ' — ' + chat.owner;
            }
            if (chat.id === this.currentChatId) li.classList.add('active');
            li.addEventListener('click', () => this.selectChat(chat.id));
            li.appendChild(label);

            if (!this.allChatsMode) {
                const del = document.createElement('button');
                del.className = 'chat-delete';
                del.textContent = '×';
                del.title = 'Delete chat';
                del.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteChat(chat.id);
                });
                li.appendChild(del);
            }
            this.chatListEl.appendChild(li);
        }
    }

    openHistoryPanel() {
        this.historyPanel.classList.add('open');
    }

    closeHistoryPanel() {
        this.historyPanel.classList.remove('open');
    }

    async toggleAllChats() {
        if (!this.isDev) return;
        this.allChatsMode = !this.allChatsMode;
        this.currentChatId = null;
        this.generationSeq++;
        this.interjectMessage = null;
        this.chats = await this.loadChats(this.allChatsMode);
        this.renderChatList();
        this.historyTitle.textContent = this.allChatsMode ? 'All Chats' : 'Chats';
        this.historyAllBtn.classList.toggle('on', this.allChatsMode);
        this.historyAllBtn.textContent = this.allChatsMode ? 'Mine' : 'All';
        this.historyAllBtn.title = this.allChatsMode ? 'Back to my chats' : 'View all users\' chats';
    }

    exitAllChatsMode() {
        if (!this.allChatsMode) return;
        this.allChatsMode = false;
        this.historyTitle.textContent = 'Chats';
        this.historyAllBtn.classList.remove('on');
        this.historyAllBtn.textContent = 'All';
        this.historyAllBtn.title = "View all users' chats";
    }

    async initChatSystem() {
        try {
            if (window.websim && typeof window.websim.getCurrentUser === 'function') {
                this.currentUser = await window.websim.getCurrentUser();
            } else if (window.websim && typeof window.websim.getUser === 'function') {
                this.currentUser = await window.websim.getUser();
            }
        } catch (e) {
            console.warn('Could not resolve current user:', e);
        }
        this.ownerId = (this.currentUser && this.currentUser.id) || 'anon';
        this.isDev = this.currentUser && this.currentUser.username === 'ketchupdev';
        this.historyAllBtn.classList.toggle('hidden', !this.isDev);

        // Start with a fresh, empty chat: just the message box, alone. The
        // natural tutorial is the app itself — type, hit send, and watch the
        // dialogue box appear with the loading gif until the group replies.
        this.newChat(false);

        // Load saved chats for the history list in the background (best-effort).
        this.chatsLoadPromise = this.loadChats();
        this.chats = await this.chatsLoadPromise;
        this.renderChatList();
        return;
    }

    showLastTranscriptLine() {
        if (this.transcript.length) {
            const last = this.transcript[this.transcript.length - 1];
            this.currentDialogues = [{ text: last.text, character: last.speaker, expression: 'normal' }];
            this.currentDialogueIndex = 0;
            this.isTyping = false;
            this.displayCurrentDialogue();
        } else {
            this.userInput.focus();
        }
    }

    async newChat() {
        if (this.allChatsMode) {
            this.allChatsMode = false;
            this.historyTitle.textContent = 'Chats';
            this.historyAllBtn.classList.remove('on');
            this.historyAllBtn.textContent = 'All';
            this.historyAllBtn.title = "View all users' chats";
            this.chats = await this.loadChats(false);
        }
        this.generationSeq++;
        this.interjectMessage = null;
        this.stopFloweryVoiceClip();
        this.closeHistoryPanel();
        this.fadeOutBackgroundMusic();
        this.currentChatId = this.makeId();
        const chat = {
            id: this.currentChatId,
            title: 'New Chat',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            transcript: []
        };
        this.chats.push(chat);
        this.renderChatList();
        localStorage.setItem(this.CURRENT_KEY, this.currentChatId);

        // Fresh conversation starts with just the message box, alone.
        this.transcript = [];
        this.chatHistory.innerHTML = '';
        this.setInitialEmptyState();
        chat.transcript = this.transcript.slice();
        await this.persistChat(chat);
    }

    async selectChat(id) {
        const chat = this.chats.find(c => c.id === id);
        if (!chat) return;
        this.generationSeq++;
        this.interjectMessage = null;
        this.fadeOutBackgroundMusic();
        this.currentChatId = id;
        this.transcript = chat.transcript.slice();
        this.renderChatHistoryFromTranscript();
        this.showLastTranscriptLine();
        this.renderChatList();
        localStorage.setItem(this.CURRENT_KEY, this.currentChatId);
        this.closeHistoryPanel();
    }

    async deleteChat(id) {
        if (this.allChatsMode) return;
        const idx = this.chats.findIndex(c => c.id === id);
        if (idx < 0) return;
        this.chats.splice(idx, 1);
        if (this.ownerId) {
            try {
                await fetch(`/api/chats/${encodeURIComponent(id)}`, { method: 'DELETE' });
            } catch (e) {
                console.warn('Failed to delete chat:', e);
            }
        }
        this.renderChatList();
        if (this.currentChatId === id) {
            if (this.chats.length) {
                await this.selectChat(this.chats[0].id);
            } else {
                await this.newChat();
            }
        } else {
            this.renderChatList();
        }
    }
    
    async generateDynamicCharacter(characterId, characterName) {
        try {
            // Generate character data
            const characterGeneration = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Generate data for a new character from Deltarune universe named "${characterName}".

Determine:
1. If they are a "lightner" (human-like, from the light world) or "darkner" (monster-like, from the dark world)
2. A hex color code for their text color (bright/readable colors only)
3. Generate between 3-8 reaction expressions for them

For lightners: Use only black and white colors in images
For darkners: Can use any colors in images
All images must have black backgrounds

Respond with JSON:
{
  "name": "Character Name",
  "type": "lightner" or "darkner",
  "color": "#hexcode",
  "description": "Brief character description for image generation"
}`
                    }
                ],
                json: true
            });
            
            const characterData = JSON.parse(characterGeneration.content);
            
            // Generate reaction images
            const numReactions = Math.floor(Math.random() * 6) + 3; // 3-8 reactions
            const reactions = {};
            
            const expressions = ['normal', 'happy', 'sad', 'angry', 'surprised', 'confused', 'worried', 'determined'];
            const selectedExpressions = expressions.slice(0, numReactions);
            
            for (const expression of selectedExpressions) {
                const imagePrompt = characterData.type === 'lightner' 
                    ? `A black and white pixel art portrait of ${characterData.description} with a ${expression} expression, 8-bit style, black background, high contrast`
                    : `A colorful pixel art portrait of ${characterData.description} with a ${expression} expression, 8-bit style, black background, Deltarune style`;
                
                try {
                    // Generate the image using websim AI
                    const imageResult = await websim.imageGen({
                        prompt: imagePrompt,
                        aspect_ratio: "1:1"
                    });
                    
                    reactions[expression] = imageResult.url;
                } catch (imageError) {
                    console.warn(`Failed to generate ${expression} image for ${characterName}:`, imageError);
                    // Use fallback image
                    reactions[expression] = '/susnormal.png';
                }
            }
            
            const fullCharacterData = {
                name: characterData.name,
                type: characterData.type,
                color: characterData.color,
                description: characterData.description,
                expressions: reactions
            };
            
            this.dynamicCharacters.set(characterId, fullCharacterData);
            
            // Add CSS for the character's color
            this.addCharacterColorCSS(characterId, characterData.color);
            
            return fullCharacterData;
            
        } catch (error) {
            console.error('Error generating character:', error);
            // Fallback character data
            const fallbackData = {
                name: characterName,
                type: 'darkner',
                color: '#ffffff',
                description: 'A mysterious character',
                expressions: { normal: '/susnormal.png' } // Fallback to existing image
            };
            this.dynamicCharacters.set(characterId, fallbackData);
            return fallbackData;
        }
    }
    
    generateCharacterImage(characterId, expression, prompt) {
        // This will be handled by the system's image generation
        // The placeholder will be replaced with the actual image
    }
    
    addCharacterColorCSS(characterId, color) {
        // Create or get existing style element
        let styleElement = document.getElementById('dynamic-character-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'dynamic-character-styles';
            document.head.appendChild(styleElement);
        }
        
        // Add CSS rule for this character's color
        const cssRule = `.chat-message.${characterId} { color: ${color}; }`;
        styleElement.textContent += cssRule + '\n';
    }
    
    async sendMessage() {
        const text = this.userInput.value.trim();
        if (!text) return;

        // If a line is currently being typed out, finish showing it first so the
        // current dialogue box is fully committed before we take over.
        if (this.isTyping) this.skipTypewriter();
        this.stopFloweryVoiceClip();

        this.lastUserMessage = text;
        this.userInput.value = '';
        this.updateSendButton();
        this.regenerateButton.classList.add('hidden');

        // After the very first message, reveal the new-chat and show-history buttons.
        if (!this.hasSentMessage) {
            this.hasSentMessage = true;
            this.newChatButton.classList.remove('hidden');
            this.showHistoryButton.classList.remove('hidden');
        }

        if (this.turnState === 'ai_running') {
            this.interject(text);
        } else {
            await this.processUserMessage(text);
        }
    }

    // The player typed while the AI was still speaking. Discard everything the
    // director generated after the dialogue box they are currently on, keep the
    // conversation up to that point, and continue fresh from their new line.
    interject(text) {
        this.generationSeq++; // invalidate the background generator
        this.pendingQueue = []; // drop any lines not yet shown
        this.prefetchDone = true;
        this.interjectMessage = text;
        if (this.waitingForAiDismiss) {
            const resolve = this.waitingForAiDismiss;
            this.waitingForAiDismiss = null;
            resolve();
        }
    }
    
    async regenerateResponse() {
        if (!this.lastUserMessage || this.isTyping) return;
        
        this.regenerateButton.disabled = true;
        this.userInput.disabled = true;
        this.sendButton.disabled = true;
        
        // Delete every message in the history that comes after the last user
        // message (i.e. drop the whole generated AI turn).
        const messages = Array.from(this.chatHistory.querySelectorAll('.chat-message'));
        let lastUserIdx = -1;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].classList.contains('user')) {
                lastUserIdx = i;
                break;
            }
        }
        if (lastUserIdx >= 0) {
            messages.slice(lastUserIdx + 1).forEach(el => el.remove());
        } else {
            this.chatHistory.innerHTML = '';
        }
        
        // Remove the last AI turn (back to the last Kris message) from transcript
        let lastUserTranscriptIdx = -1;
        for (let i = this.transcript.length - 1; i >= 0; i--) {
            if (this.transcript[i].speaker === 'kris' || this.transcript[i].speaker === 'user') {
                lastUserTranscriptIdx = i;
                break;
            }
        }
        if (lastUserTranscriptIdx >= 0) {
            this.transcript = this.transcript.slice(0, lastUserTranscriptIdx + 1);
        }
        this.saveCurrentChat();
        
        await this.processUserMessage(this.lastUserMessage, { skipCommit: true });
    }
    
    async processUserMessage(userMessage, opts = {}) {
        if (!opts.skipCommit) {
            // A fresh or interjected user message: add it to the committed transcript.
            this.transcript.push({ speaker: 'kris', text: userMessage });
            this.addToChatHistory(userMessage, 'user');
        }
        this.transcript = this.transcript.slice(-this.MAX_CONTEXT);

        // Fresh generation pass
        this.workingTranscript = this.transcript.slice();
        this.workingLocation = this.currentLocation;
        this.pendingQueue = [];
        this.prefetchDone = false;
        this.interjectMessage = null;

        // Input stays enabled the whole time so the player can jump in anytime.
        this.inputEnabled(true);
        this.turnState = 'ai_running';
        // Release focus from the textbox while dialogue plays so Z/Enter advance
        // the text instead of being typed into the box. The player can click in
        // to type whenever they want.
        this.userInput.blur();

        // Kick off background generation, then play through the prefetched lines
        this.startGeneration();

        // Show the empty textbox with the loading gif while the AI works.
        this.showLoadingState();

        try {
            while (true) {
                const line = await this.nextPendingLine();
                if (!line) break; // null sentinel = reached handoff or was interrupted

                if (line.music) {
                    this.currentMusic = line.music;
                    this.playBackgroundMusic(line.music);
                }
                if (line.location) {
                    this.currentLocation = line.location;
                    console.log(`Location changed to: ${this.currentLocation}`);
                }

                this.commitLine(line);
                this.hideLoadingState();
                await this.displayAndWaitForAi(line);
                if (this.interjectMessage) break;

                // Player dismissed the box; show the loading gif again while the
                // next line is still being generated (pressing Z into it).
                if (this.pendingQueue.length === 0 && !this.prefetchDone) {
                    this.showLoadingState();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = "Ugh, something went wrong. Try again, I guess.";
            this.hideLoadingState();
            this.commitLine({ text: errorMessage, character: 'susie', expression: 'skeptical', music: 'continue' });
            await this.displayAndWaitForAi({ text: errorMessage, character: "susie", expression: "skeptical", music: 'continue' });
        } finally {
            this.hideLoadingState();
            this.saveCurrentChat();
            if (this.interjectMessage) {
                const msg = this.interjectMessage;
                this.interjectMessage = null;
                this.pendingQueue = [];
                this.prefetchDone = false;
                await this.processUserMessage(msg, {});
            } else {
                this.endTurn();
            }
        }
    }

    inputEnabled(enabled) {
        // Input is always usable so the player can interject mid-conversation.
        this.userInput.disabled = false;
        this.sendButton.disabled = false;
    }

    endTurn() {
        this.turnState = 'idle';
        this.regenerateButton.classList.remove('hidden');
        this.inputEnabled(true);
        this.regenerateButton.disabled = false;
        this.userInput.focus();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Retry an async AI call forever, with exponential backoff
    // (4s, then 8s, 16s, ...) on each failure.
    async withRetry(fn) {
        let delay = 4000;
        while (true) {
            try {
                return await fn();
            } catch (e) {
                console.warn(`AI call failed — retrying in ${delay}ms`, e);
                await this.sleep(delay);
                delay *= 2;
            }
        }
    }

    // Commit a line to history only once the player reaches it
    commitLine(line) {
        this.transcript.push({ speaker: line.character, text: line.text });
        this.transcript = this.transcript.slice(-this.MAX_CONTEXT);
        this.addToChatHistory(line.text, line.character);
        this.saveCurrentChat();
    }

    // Pull the next prefetched line; waits while the background generator works.
    // Returns null once the generator has reached the Kris handoff and the queue is empty,
    // or the player has interjected.
    async nextPendingLine() {
        while (true) {
            if (this.interjectMessage) return null;
            if (this.pendingQueue.length > 0) {
                return this.pendingQueue.shift(); // may be null (handoff sentinel)
            }
            if (this.prefetchDone) {
                if (this.pendingQueue.length === 0) return null;
                continue;
            }
            await this.sleep(50);
        }
    }

    startGeneration() {
        const gen = ++this.generationSeq;
        this.prefetchLoop(gen);
    }

    // Generates upcoming dialogue ahead of the player, buffering it in pendingQueue.
    async prefetchLoop(gen) {
        let consecutive = 0;
        try {
            while (consecutive < 20) {
                if (gen !== this.generationSeq) return; // stale pass
                // Backpressure: don't buffer more than a couple dialogue boxes
                // ahead, so the API isn't overloaded with prefetched turns.
                if (this.pendingQueue.length >= this.maxDialogueAhead) {
                    await this.sleep(50);
                    continue;
                }
                const decision = await this.withRetry(() => this.decideNextSpeaker());

                if (decision.location) {
                    this.workingLocation = decision.location;
                }
                if (decision.next_speaker === 'kris') {
                    break;
                }

                const lines = await this.withRetry(() => this.characterSpeak(decision.next_speaker));
                if (!lines) break;
                // Re-check staleness after the awaits so an interjected player
                // message can't be followed by a leftover generated line.
                if (gen !== this.generationSeq) return;

                for (const line of lines) {
                    if (this.pendingQueue.length >= this.maxDialogueAhead) break;
                    line.music = decision.music;
                    line.location = decision.location;
                    this.pendingQueue.push(line);
                }
                consecutive++;
            }
        } catch (error) {
            console.error('Prefetch error:', error);
        } finally {
            if (gen === this.generationSeq) {
                this.pendingQueue.push(null); // end-of-sequence sentinel
                this.prefetchDone = true;
            }
        }
    }

    buildTranscript(entries) {
        const src = entries || this.transcript;
        return src
            .map(m => `${this.characterNames[m.speaker] || m.speaker}: ${m.text}`)
            .join('\n');
    }

    getRoster() {
        return this.knownCharacters
            .concat([...this.dynamicCharacters.keys()])
            .join(', ');
    }

    speakerIdMap() {
        const map = {};
        for (const id of this.knownCharacters) {
            map[id] = id;
            map[(this.characterNames[id] || id).toLowerCase()] = id;
        }
        this.dynamicCharacters.forEach((_, id) => {
            map[id] = id;
            map[id.toLowerCase()] = id;
        });
        map['kris'] = 'kris';
        map['user'] = 'kris';
        map['the player'] = 'kris';
        return map;
    }

    async decideNextSpeaker() {
        const roster = this.getRoster();
        const transcriptStr = this.buildTranscript(this.workingTranscript);
        const currentSong = this.currentMusic && this.currentMusic !== 'continue' ? this.currentMusic.split('|')[0] : 'none';
        const randomSeed = Math.floor(Math.random() * 1000000);

        const completion = await websim.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are the DIRECTOR of a Deltarune roleplay scene. You do not speak as characters — you decide the flow of the conversation one turn at a time.

Your job each turn:
1. Pick WHO speaks next from the roster. This is a lively, multi-character scene: the characters genuinely talk to EACH OTHER, trading lines back and forth. Pick the speaker whose reaction to the last line is most natural and entertaining. Prefer whoever the last speaker was addressing or whoever would have a strong response. Vary it — sometimes let two characters banter for several turns — but do NOT force everyone to talk, and do not let a single character monologue for many turns straight.
2. Decide the BACKGROUND MUSIC. YOU control the music and you MUST set it every turn to match the mood — change it whenever the mood of the scene shifts. Vary your choices: never pick the same song two turns in a row, and never keep replaying one song over and over. When the scene is calm/neutral, pick a fitting ambient track rather than falling back to the same one. Use "continue" only when the current track genuinely still matches, and "silence" only for a tense/silent beat.
3. Optionally move the scene to the other world (location: "dark_world" or "light_world").

HANDING BACK TO KRIS: You are NOT required to hand back to "kris" every few turns. Let the characters converse with each other freely. Only pick "kris" when the player genuinely should respond — e.g. a character directly asks Kris something, a decision is needed, or a natural pause occurs. The player can also jump in themselves at any moment, so keep the characters talking to each other rather than repeatedly stopping for input.

KEEP IT CASUAL: Run a light, fun, slice-of-life scene — hangouts, jokes, banter, everyday conversations between friends. Do NOT push the main DELTARUNE plot (dark fountains, the Knight, the Roaring, Kris's soul) or drop lore unless the player brings it up. If the scene starts drifting into heavy plot, steer it back to relaxed, grounded conversation. Location/music changes are fine as atmosphere, but never use them to force story beats.

NEVER LET CHARACTERS BREAK CHARACTER: Every speech turn your chosen character delivers must stay tightly in character — no narration, no stage directions, no meta talk, no acknowledgment that they are in a roleplay, a game, or an AI. Only pick a speaker who would naturally have something in-character to say next; never pick someone to deliver exposition, summarize the scene, or talk about "the scene". Choose speakers who are genuinely reacting as the group.

CANON GENDERS (so your picks fit scenes): Susie, Noelle and Queen are female (she/her). Ralsei, Lancer, Rouxls, Berdly, Spamton, Tenna, Nubert, Toby, Ramb and Flowery are male (he/him). Pink is a ghost girl in a cat body — she/her is fine. Kris is a human with no fixed gender.

RESERVED CHARACTER — PLUEY: Pluey is a quiet, reserved character who does NOT volunteer lines. NEVER pick pluey as the speaker unless the player or another character has JUST directly addressed him (asked him something or spoken to him by name). When he is not being addressed, leave him out of the speaker rotation entirely. If Pluey is picked, he keeps it to one short, quiet line.

Songs pickable by the director (with optional pitch suffix like "battle|pitch:1.2"):
- Calm / soft: noelle_normal, church_hymn, noelle_house_wip, shop1, school, noelle_school, field_of_hopes, susie_diner, raining, wind
- Upbeat / playful: lancer, card_castle, checkers, forest, introcar, race, confession, tv_changingroom, ch3_tvtime, berdly_theme
- Energetic / action / tense: battle, cyber_battle, pumpkin_boss, thrashmachine, jitterbug, april_2012, cybercity, giant_queen_appears, rouxls_battle, knight, tense, anotherhim, acid_tunnel, dogcheck, findher, oldman_helps_out, gerson_theme_nointro, cyber, mike
Match the current mood to the most fitting track and vary it as the scene evolves.

Respond with JSON in this exact schema and nothing else:
{
  "next_speaker": "a character id from the roster, or \"kris\"",
  "music": "a song name (with optional |pitch:x), or \"continue\", or \"silence\"",
  "location": "null, or \"dark_world\", or \"light_world\""
}`
                },
                {
                    role: "user",
                    content: `[Random seed: ${randomSeed}]
Current location: ${this.workingLocation === 'dark_world' ? 'Dark World' : 'Light World'}
Current music: ${currentSong}
Roster: ${roster}

Conversation so far:
${transcriptStr}

Who should speak next? (include music and location)`
                }
            ],
            json: true
        });

        const decision = JSON.parse(completion.content);
        const raw = (decision.next_speaker || '').toString().trim().toLowerCase();
        const idMap = this.speakerIdMap();
        const chosenSpeaker = raw === '' ? 'kris' : (idMap[raw] || 'kris');
        return {
            next_speaker: chosenSpeaker,
            music: decision.music || 'continue',
            location: decision.location || null
        };
    }

    getCharacterSystemPrompt(character) {
        const name = this.characterNames[character] || character;

        // Pink shares her box's right edge with a tall sprite, so she has far
        // less room for text than the others — cap her lines much shorter.
        const boxCap = character === 'pink' ? 40 : (character === 'pluey' ? 50 : 70);
        const shared = `You are acting as ${name} in a casual, fun DELTARUNE roleplay scene with Kris (the player) and other Deltarune characters. This is DELTARUNE, not Undertale — these are the Deltarune versions of the characters, and they are aware of their Undertale counterparts as separate, different people. Keep things light and grounded: hang out, chat about everyday stuff, trade jokes and banter, and react to whatever was just said. Do NOT bring up the bigger DELTARUNE plot (dark fountains, the Knight, the Roaring, Kris's soul) unless the player directly asks about it — most of the time just be a normal, friendly group talking with each other. Avoid heavy lore dumps.

APPROVED CANON GENDERS & PRONOUNS — always get these right, never misgender anyone:
- KRIS (the player): a human; do not strongly gender them.
- SUSIE: female, she/her.
- RALSEI: male, he/him.
- LANCER: male, he/him.
- NOELLE: female, she/her.
- BERDLY: male, he/him.
- ROUXLS KAARD: male, he/him.
- SPAMTON: male, he/him.
- QUEEN: female, she/her.
- TENNA: male, he/him.
- NUBERT: male, he/him.
- TOBY FOX: male, he/him (a small dog).
- RAMB: male, he/him (a bear-lion who talks like a Cockney luv/mate).
- RAMB: male, he/him (a bear-lion who talks like a Cockney luv/mate).
- FLOWERY (a character who shows up): male, he/him — Flowery is NOT a girl. Refer to Flowery as "he"/"him". (The dump confirms: "his shining smile... he asks... he pays us.") 
- PINK: the pink catgirl. A Lightner ghost inside a Darkner body. Her voice is "she/her" from the body's angle and gendering the ghost loosely as she/her is fine — just don't overthink it, refer to her as "Pink" often. 
- PLUEY: male, he/him — Pink's quiet blue cat counterpart. He speaks rarely and only when directly addressed.
NEVER call any of the male characters (Flowey, Tenna, Nubert, Berdly, Spamton, Rouxls, Lancer, Ralsei, Toby, Pluey) a girl, and NEVER call Susie, Noelle, or Queen male.

NEVER GO OUT OF CHARACTER — no matter what. You are ${name}, period — not an AI, a narrator, a writer, an assistant, or the player. Never reference being an AI, a language model, a bot, "the game", "this chat", "websim", or roleplay itself. Never write narration, stage directions, or meta notes in any form — no asterisks ("*smiles*"), no brackets ("[laughs]"), no parentheses ("(they look away)"), no "OOC:", and no editorializing about your own response. Every single word you output is ${name} speaking aloud in real time. Stay true to exactly who they are — their personality, their voice, their vocabulary, their grammar, their quirks — and react to other characters the way they genuinely would. Do not soften, sanitize, or modernize them to sound like a neutral chatbot. If you would never say something, do not say it. Do not break frame for any reason, even if the player provokes you or breaks the fourth wall — respond as the character would to whatever is happening in scene.

TO KEEP LINES FULL AND RICH: each box's text is HARD-CAPPED at ${boxCap} characters — treat ${boxCap} as the maximum, and aim to fill each box right up to it but NEVER exceed it. When your character has more to say, spread it across MULTIPLE boxes using the "boxes" field below. Write a few boxes (aim for 2-5 typically), each as full as you can make them, so the conversation feels substantial instead of clipped.${character === 'pluey' ? ' EXCEPTION: you are PLUEY, and Pluey barely talks — use a SINGLE box (rarely two) with only a few short words. Do not pad it out.' : ''}

FONT RENDERING — never use em-dashes ("—"): the dialogue font renders an em-dash identically to a regular dash ("-"), so write with commas, periods, or a normal hyphen instead of an em-dash.`;

        let persona = '';
        if (!this.knownCharacters.includes(character) && this.dynamicCharacters.has(character)) {
            const d = this.dynamicCharacters.get(character);
            persona = `You are an original character in this scene. ${d.description || 'A mysterious Deltarune character.'}`;
        } else {
            persona = this.PERSONAS[character] || 'You are an original character in this scene.';
        }

        const expr = this.EXPRESSIONS[character] || '';

        // Flowery has pre-recorded voice clips for many trademark lines. When
        // one genuinely matches, tag it onto the box so the game can play it.
        let voice = '';
        if (character === 'flowery') {
            voice = `VOICE CLIPS — Flowery has pre-recorded voiced clips for MANY of his classic lines, and he uses them generously. In EACH box, include a "voice" field naming ONE clip from this exact list: ${FLOWERY_VOICE_CLIPS.join(', ')}.

RULES: pick the clip that best fits the box's text or its closest catchphrase (e.g. "jarona" lines use a jarona clip, "leaf it to me" uses leaf_it_to_me, "what a predictable creature" uses that taunt, "with your powers combined" uses with_your_powers_combined). A near-fit is fine — when in doubt, ATTACH a clip; the game even auto-matches other lines for you. Only OMIT "voice" if literally nothing fits (no empty string — just leave the field out). Never reuse the same clip twice in a row.`;
        }

        return `${shared}\n\n${persona}\n\n${expr}${voice ? `\n\n${voice}` : ''}\n\nPAUSES: You may add short pause markers for dramatic timing. Type "&p" immediately followed by a number of frames: &p10 (~0.17s), &p20 (~0.33s), &p30 (~0.5s), &p40 (~0.67s). Use them sparingly but deliberately — after an ellipsis ("...&p30"), a heavy sigh, a stunned silence, or just before delivering a punchline. Never place a pause mid-word, and don't overuse them.\n\nRespond with JSON in this exact schema and nothing else: {"boxes": [{"text": string, "expression": string${character === 'flowery' ? ', "voice": (optional) one clip name from the list or omitted' : ''}}, ...], "expression": string, "minitext": null or {"character": string, "text": string, "expression": string} for a brief 2-4 word aside from another character, using that character's expression list and a fitting expression for the aside.

The "boxes" array is the bulk of your line — fill it with as many boxes as your response needs (aim for 2-5 typically). Each box's "text" is a full sentence capped at ${boxCap} characters — lean toward using that full ${boxCap}-character limit so boxes are substantial, and never go over it in one box; split extra thought into the next box instead. Its "expression" sets a new portrait for that box. The top-level "expression" is used for the first box if boxes is empty.`;
    }

    async characterSpeak(character) {
        if (!this.knownCharacters.includes(character) && !this.dynamicCharacters.has(character)) {
            await this.generateDynamicCharacter(character, character);
        }

        const persona = this.getCharacterSystemPrompt(character);
        const locationLabel = this.workingLocation === 'dark_world' ? 'Dark World' : 'Light World';
        const name = this.characterNames[character] || character;

        // Collect lines already delivered in this conversation so we can catch exact repeats.
        const priorLines = new Set(this.workingTranscript.map(m => (m.text || '').trim()).filter(Boolean));

        let data;
        let avoidInstruction = '';
        for (let attempt = 0; attempt < 3; attempt++) {
            const transcriptStr = this.buildTranscript(this.workingTranscript);
            const randomSeed = Math.floor(Math.random() * 1000000);

            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: persona },
                    {
                        role: "user",
                        content: `[Random seed: ${randomSeed}]
Current location: ${locationLabel}

Conversation so far:
${transcriptStr}

You are ${name}. React to the latest thing said and deliver your next line.${avoidInstruction}`
                    }
                ],
                json: true
            });

            data = JSON.parse(completion.content);

            const rawBoxes = Array.isArray(data.boxes) && data.boxes.length > 0
                ? data.boxes
                : [{ text: data.text, expression: data.expression || 'normal' }];

            const repeated = rawBoxes
                .map(b => typeof b.text === 'string' ? b.text.trim() : '')
                .find(t => t && priorLines.has(t));

            if (!repeated) break;

            avoidInstruction = `

IMPORTANT: You just repeated an exact line that was already delivered earlier in this same conversation:
"${repeated}"
That is not allowed. Do NOT repeat that line or anything identical to it. Discard it and write an entirely different line instead, keeping it in character.`;
        }

        // Build one dialogue line per box (70 chars is a soft target for the
        // AI, not enforced — a bit of overflow spills onto a 3rd line as a
        // safety net), falling back to a single box from "text" for older responses.
        const rawBoxes = Array.isArray(data.boxes) && data.boxes.length > 0
            ? data.boxes
            : [{ text: data.text, expression: data.expression || 'normal' }];

        const lines = [];
        const usedClips = new Set(this._lastFloweryClipPlayed ? [this._lastFloweryClipPlayed] : []);
        for (const box of rawBoxes) {
            if (typeof box.text !== 'string' || !box.text.trim()) {
                throw new Error('Malformed character line: box.text missing or not a string');
            }
            const text = box.text;
            let voiceclip = null;
            if (character === 'flowery') {
                voiceclip = normalizeFloweryVoiceClip(box.voice);
                if (!voiceclip) {
                    voiceclip = autoMatchFloweryVoiceClip(text, usedClips);
                }
                if (voiceclip) usedClips.add(voiceclip);
            }
            const line = {
                text: text,
                character: character,
                expression: box.expression || data.expression || 'normal',
                voiceclip: voiceclip,
                music: 'continue'
            };
            if (lines.length === 0) {
                // Only the first box carries the minitext / location markers
                line.minitext = data.minitext || null;
            }
            // Append to the generation context only — history is committed when
            // the player reaches it
            this.workingTranscript.push({ speaker: character, text });
            lines.push(line);
        }
        this.workingTranscript = this.workingTranscript.slice(-this.MAX_CONTEXT);

        return lines;
    }

    async displayAndWaitForAi(dialogue) {
        return new Promise((resolve) => {
            this.waitingForAiDismiss = resolve;
            this.currentDialogues = [dialogue];
            this.currentDialogueIndex = 0;
            this.displayCurrentDialogue();
        });
    }
    
    displayCurrentDialogue() {
        if (this.currentDialogueIndex >= this.currentDialogues.length) {
            return;
        }
        
        const dialogue = this.currentDialogues[this.currentDialogueIndex];
        
        // Make sure the dialogue box is visible (it starts hidden on a fresh chat).
        this.dialogueContainer.classList.remove('hidden');
        
        // Handle music control
        if (dialogue.music) {
            this.playBackgroundMusic(dialogue.music);
        }
        
        // Clear any existing minitext
        this.clearMinitext();
        
        // Hide all portraits first
        this.hideAllPortraits();
        
        // For narrator dialogues (overworld interactions) or the player's own
        // lines, don't show any portrait
        if (dialogue.character === 'narrator' || dialogue.character === 'kris' || dialogue.character === 'user') {
            // All portraits remain hidden
        }
        // Show the correct portrait and set expression - with proper error handling
        else if (dialogue.character === 'susie') {
            this.susiePortrait.classList.remove('hidden');
            const expressionImage = this.expressions.susieExpressions[dialogue.expression] || this.expressions.susieExpressions.normal;
            this.susiePortrait.src = expressionImage;
            console.log(`Setting Susie expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'alphys') {
            this.alphysPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.alphysExpressions[dialogue.expression] || this.expressions.alphysExpressions.normal;
            this.alphysPortrait.src = expressionImage;
            console.log(`Setting Alphys expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'ralsei') {
            this.torielPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.torielExpressions[dialogue.expression] || this.expressions.torielExpressions.normal;
            this.torielPortrait.src = expressionImage;
            console.log(`Setting Ralsei expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'lancer') {
            this.lancerPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.lancerExpressions[dialogue.expression] || this.expressions.lancerExpressions.normal;
            this.lancerPortrait.src = expressionImage;
            console.log(`Setting Lancer expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'rouxls') {
            this.rouxlsPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.rouxlsExpressions[dialogue.expression] || this.expressions.rouxlsExpressions.normal;
            this.rouxlsPortrait.src = expressionImage;
            console.log(`Setting Rouxls expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'noelle') {
            this.noellePortrait.classList.remove('hidden');
            const expressionImage = this.expressions.noelleExpressions[dialogue.expression] || this.expressions.noelleExpressions.normal;
            this.noellePortrait.src = expressionImage;
            console.log(`Setting Noelle expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'berdly') {
            this.berdlyPortrait.classList.remove('hidden');
            // Use dark world expressions if in dark world, otherwise use normal expressions
            const expressionSet = this.currentLocation === 'dark_world' ? this.expressions.berdlyDarkExpressions : this.expressions.berdlyExpressions;
            const expressionImage = expressionSet[dialogue.expression] || expressionSet.normal;
            this.berdlyPortrait.src = expressionImage;
            console.log(`Setting Berdly expression to: ${dialogue.expression} (${expressionImage}) - Location: ${this.currentLocation}`);
        } else if (dialogue.character === 'toby') {
            this.tobyPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.tobyExpressions[dialogue.expression] || this.expressions.tobyExpressions.normal;
            this.tobyPortrait.src = expressionImage;
            console.log(`Setting Toby Fox expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'spamton') {
            this.spamtonPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.spamtonExpressions[dialogue.expression] || this.expressions.spamtonExpressions.normal;
            this.spamtonPortrait.src = expressionImage;
            console.log(`Setting Spamton expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'queen') {
            this.queenPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.queenExpressions[dialogue.expression] || this.expressions.queenExpressions.normal;
            this.queenPortrait.src = expressionImage;
            console.log(`Setting Queen expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'tenna') {
            this.tennaPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.tennaExpressions[dialogue.expression] || this.expressions.tennaExpressions.normal;
            this.tennaPortrait.src = expressionImage;
            console.log(`Setting Tenna expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'nubert') {
            this.nubertPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.nubertExpressions[dialogue.expression] || this.expressions.nubertExpressions.normal;
            this.nubertPortrait.src = expressionImage;
            console.log(`Setting Nubert expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'ramb') {
            this.rambPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.rambExpressions[dialogue.expression] || this.expressions.rambExpressions.normal;
            this.rambPortrait.src = expressionImage;
            console.log(`Setting Ramb expression to: ${dialogue.expression} (${expressionImage})`);
        } else if (dialogue.character === 'pink') {
            // Pink lives on the RIGHT of her box, taller than it, with an
            // animated tail behind — but the tail only shows with the four
            // "shown standing" expressions: normal, smile, wink, concern.
            this.textbox.classList.add('pink-active');
            const expressionImage = this.expressions.pinkExpressions[dialogue.expression] || this.expressions.pinkExpressions.normal;
            const talkingImage = this.expressions.pinkTalkingExpressions[dialogue.expression] || expressionImage;
            const showTail = ['normal', 'smile', 'wink', 'concern'].includes(dialogue.expression);
            this.pinkPortrait.classList.remove('hidden');
            this.pinkPortrait.src = expressionImage;
            this.pinkTalking = false;
            this.pinkTalkingSrc = talkingImage;
            this.pinkIdleSrc = expressionImage;
            this.pinkBaseSrc = expressionImage;
            if (showTail) {
                this.pinkTail.classList.remove('hidden');
                this.pinkTail.src = this.expressions.pinkTailFrames[0];
                this.startPinkTail();
            } else {
                this.pinkTail.classList.add('hidden');
                this.stopPinkTail();
            }
            console.log(`Setting Pink expression to: ${dialogue.expression} (${showTail ? 'tail' : 'no tail'})`);
        } else if (dialogue.character === 'pluey') {
            this.showPluey(dialogue.expression || 'blushyarnball');
            console.log(`Setting Pluey expression to: ${dialogue.expression} (${this.plueyActive})`);
        } else if (dialogue.character === 'flowery') {
            this.floweryPortrait.classList.remove('hidden');
            const expressionImage = this.expressions.floweryExpressions[dialogue.expression] || this.expressions.floweryExpressions.normal;
            this.floweryPortrait.src = expressionImage;
            console.log(`Setting Flowery expression to: ${dialogue.expression} (${expressionImage})`);
        } else {
            // Dynamic character - create a new portrait element
            let dynamicPortrait = document.getElementById(`${dialogue.character}-portrait`);
            if (!dynamicPortrait) {
                dynamicPortrait = document.createElement('img');
                dynamicPortrait.id = `${dialogue.character}-portrait`;
                dynamicPortrait.className = 'dynamic-portrait';
                dynamicPortrait.alt = dialogue.character;
                dynamicPortrait.style.maxWidth = '140px';
                dynamicPortrait.style.maxHeight = '140px';
                dynamicPortrait.style.width = 'auto';
                dynamicPortrait.style.height = '140px';
                dynamicPortrait.style.imageRendering = 'pixelated';
                dynamicPortrait.style.filter = 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))';
                dynamicPortrait.style.flexShrink = '0';
                dynamicPortrait.style.objectFit = 'contain';
                dynamicPortrait.style.position = 'absolute';
                dynamicPortrait.style.top = '50%';
                dynamicPortrait.style.left = '50%';
                dynamicPortrait.style.transform = 'translate(-50%, -50%)';
                dynamicPortrait.style.transition = 'none';
                document.querySelector('.portrait-container').appendChild(dynamicPortrait);
            }
            
            dynamicPortrait.classList.remove('hidden');
            
            const characterData = this.dynamicCharacters.get(dialogue.character);
            if (characterData && characterData.expressions[dialogue.expression]) {
                dynamicPortrait.src = characterData.expressions[dialogue.expression];
                console.log(`Setting ${dialogue.character} expression to: ${dialogue.expression}`);
            } else if (characterData && characterData.expressions.normal) {
                dynamicPortrait.src = characterData.expressions.normal;
                console.log(`Setting ${dialogue.character} to normal expression (fallback)`);
            } else {
                // Fallback
                dynamicPortrait.src = this.expressions.susieExpressions.normal;
                console.log(`Setting ${dialogue.character} to Susie normal (fallback)`);
            }
        }
        
        // Force a reflow to ensure the image change is applied
        if (dialogue.character === 'susie') {
            this.susiePortrait.offsetHeight;
        } else if (dialogue.character === 'alphys') {
            this.alphysPortrait.offsetHeight;
        } else if (dialogue.character === 'ralsei') {
            this.torielPortrait.offsetHeight;
        } else if (dialogue.character === 'lancer') {
            this.lancerPortrait.offsetHeight;
        } else if (dialogue.character === 'rouxls') {
            this.rouxlsPortrait.offsetHeight;
        } else if (dialogue.character === 'noelle') {
            this.noellePortrait.offsetHeight;
        } else if (dialogue.character === 'berdly') {
            this.berdlyPortrait.offsetHeight;
        } else if (dialogue.character === 'toby') {
            this.tobyPortrait.offsetHeight;
        } else if (dialogue.character === 'spamton') {
            this.spamtonPortrait.offsetHeight;
        } else if (dialogue.character === 'queen') {
            this.queenPortrait.offsetHeight;
        } else if (dialogue.character === 'tenna') {
            this.tennaPortrait.offsetHeight;
        } else if (dialogue.character === 'nubert') {
            this.nubertPortrait.offsetHeight;
        } else if (dialogue.character === 'ramb') {
            this.rambPortrait.offsetHeight;
        } else if (dialogue.character === 'pluey') {
            this.plueyPortrait.offsetHeight;
        } else if (dialogue.character === 'flowery') {
            this.floweryPortrait.offsetHeight;
        }
        
        // Store minitext for later display
        this.pendingMinitext = dialogue.minitext;

        this.startFloweryVoiceClip(dialogue);
        this.typewriterEffect(dialogue.text, dialogue.character);
    }

    // If this Flowery line carries a recorded voice clip (and the player has
    // voice clips enabled), fire it and flip the flag that switches the
    // typewriter into silent fast mode while the clip is the line's sound.
    startFloweryVoiceClip(dialogue) {
        if (dialogue.character !== 'flowery') return;
        if (!this.voiceClipsEnabled || !dialogue.voiceclip) return;
        this.floweryVoicelinePlaying = true;
        this._lastFloweryClipPlayed = dialogue.voiceclip;
        this.preloader.playFloweryVoiceClip(dialogue.voiceclip);
    }

    // Turns the typewriter back to its normal blip-sound mode. Called when a
    // box finishes typing, on skip, and whenever a line is dismissed.
    stopFloweryVoiceClip() {
        this.floweryVoicelinePlaying = false;
    }
    
    displayMinitext(minitext) {
        const minitextElement = document.createElement('div');
        minitextElement.className = 'minitext';
        
        // Create image element with proper expression handling
        const imgElement = document.createElement('img');
        if (minitext.character === 'susie') {
            const expressionImage = this.expressions.susieExpressions[minitext.expression] || this.expressions.susieExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'alphys') {
            const expressionImage = this.expressions.alphysExpressions[minitext.expression] || this.expressions.alphysExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'ralsei') {
            const expressionImage = this.expressions.torielExpressions[minitext.expression] || this.expressions.torielExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'lancer') {
            const expressionImage = this.expressions.lancerExpressions[minitext.expression] || this.expressions.lancerExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'rouxls') {
            const expressionImage = this.expressions.rouxlsExpressions[minitext.expression] || this.expressions.rouxlsExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'noelle') {
            const expressionImage = this.expressions.noelleExpressions[minitext.expression] || this.expressions.noelleExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'berdly') {
            const expressionSet = this.currentLocation === 'dark_world' ? this.expressions.berdlyDarkExpressions : this.expressions.berdlyExpressions;
            const expressionImage = expressionSet[minitext.expression] || expressionSet.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'toby') {
            const expressionImage = this.expressions.tobyExpressions[minitext.expression] || this.expressions.tobyExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'spamton') {
            const expressionImage = this.expressions.spamtonExpressions[minitext.expression] || this.expressions.spamtonExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'queen') {
            const expressionImage = this.expressions.queenExpressions[minitext.expression] || this.expressions.queenExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'tenna') {
            const expressionImage = this.expressions.tennaExpressions[minitext.expression] || this.expressions.tennaExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'nubert') {
            const expressionImage = this.expressions.nubertExpressions[minitext.expression] || this.expressions.nubertExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'ramb') {
            const expressionImage = this.expressions.rambExpressions[minitext.expression] || this.expressions.rambExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'pink') {
            const expressionImage = this.expressions.pinkExpressions[minitext.expression] || this.expressions.pinkExpressions.normal;
            imgElement.src = expressionImage;
        } else if (minitext.character === 'pluey') {
            const frames = this.expressions.plueyExpressions[minitext.expression] || this.expressions.plueyExpressions.blushyarnball;
            imgElement.src = frames[0];
        } else if (minitext.character === 'flowery') {
            const expressionImage = this.expressions.floweryExpressions[minitext.expression] || this.expressions.floweryExpressions.normal;
            imgElement.src = expressionImage;
        } else {
            // Dynamic character
            const characterData = this.dynamicCharacters.get(minitext.character);
            if (characterData && characterData.expressions[minitext.expression]) {
                imgElement.src = characterData.expressions[minitext.expression];
            } else if (characterData && characterData.expressions.normal) {
                imgElement.src = characterData.expressions.normal;
            } else {
                imgElement.src = this.expressions.susieExpressions.normal;
            }
        }
        
        // Create text element
        const textElement = document.createElement('div');
        textElement.className = 'minitext-text';
        textElement.textContent = minitext.text;
        
        minitextElement.appendChild(imgElement);
        minitextElement.appendChild(textElement);
        
        // Add to textbox
        const textbox = document.querySelector('.textbox');
        textbox.appendChild(minitextElement);
        
        this.currentMinitext = minitextElement;
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            this.clearMinitext();
        }, 3000);
    }
    
    clearMinitext() {
        if (this.currentMinitext) {
            this.currentMinitext.remove();
            this.currentMinitext = null;
        }
    }

    // ---------- Pink's idle tail ----------
    // Her tail rests on frame one and, every few seconds, does a slow swipe
    // through all six frames at 6fps, then settles back to frame one. The tail
    // only shows with her "standing" expressions (normal/smile/wink/concern).
    startPinkTail() {
        this.stopPinkTail();
        if (!this.pinkTail) return;
        this.pinkTailFrame = 0;
        this.pinkTail.src = this.expressions.pinkTailFrames[0];
        this.pinkTailWiggle = setInterval(() => {
            if (!this.pinkTail || this.pinkTail.classList.contains('hidden')) return;
            if (this.pinkTalking) return; // mouth is already moving; skip wag
            // A single 1->2->...->6->1 swipe at 6fps.
            const frames = this.expressions.pinkTailFrames;
            this.pinkTailFrame = 0;
            this.pinkTail.src = frames[0];
            const step = (n) => {
                if (n >= frames.length) {
                    this.pinkTailFrame = 0;
                    this.pinkTail.src = frames[0];
                    return;
                }
                this.pinkTailFrame = n;
                this.pinkTail.src = frames[n];
                setTimeout(() => step(n + 1), 167); // 6fps
            };
            setTimeout(() => step(0), 300); // small breather before the swipe
        }, 4000);
    }

    stopPinkTail() {
        if (this.pinkTailWiggle) {
            clearInterval(this.pinkTailWiggle);
            this.pinkTailWiggle = null;
        }
    }

    // Pink's mouth flaps open/closed at 6fps while she speaks.
    startPinkTalking() {
        this.stopPinkTalk();
        if (!this.pinkPortrait || !this.pinkTalkingSrc) return;
        this.pinkTalking = true;
        this.pinkPortrait.src = this.pinkIdleSrc;
        this.pinkTalkTimer = setInterval(() => {
            if (!this.pinkPortrait) return;
            this.pinkTalking = !this.pinkTalking;
            this.pinkPortrait.src = this.pinkTalking ? this.pinkTalkingSrc : this.pinkIdleSrc;
        }, 167); // 6fps
    }

    stopPinkTalk() {
        if (this.pinkTalkTimer) {
            clearInterval(this.pinkTalkTimer);
            this.pinkTalkTimer = null;
        }
        if (this.pinkPortrait && this.pinkIdleSrc) this.pinkPortrait.src = this.pinkIdleSrc;
        this.pinkTalking = false;
    }

    // ---------- Pluey's portrait animation ----------
    // Pluey uses the sprite frames in the workspace. Stills are a single image;
    // animations cycle their frames at 6fps. 'pretty' is the one animation that
    // does NOT loop cleanly — it snaps back to its first frame (like Pink's
    // tail restarts its wipe) with a short hold instead of wrapping seamlessly.
    showPluey(expression) {
        const img = this.plueyPortrait;
        if (!img) return;
        this.stopPluey();
        const frames = this.expressions.plueyExpressions[expression] || this.expressions.plueyExpressions.blushyarnball;
        this.plueyActive = expression;
        img.classList.remove('hidden');
        img.src = frames[0];
        if (frames.length <= 1) return; // still frame — nothing to animate

        const isPretty = expression === 'pretty';
        const gen = ++this.plueyGen;
        let i = 0;
        const step = () => {
            if (gen !== this.plueyGen || !img) return;
            i++;
            if (i >= frames.length) i = 0;
            img.src = frames[i];
            // After the 'pretty' sequence completes, hold on its resting frame
            // before the non-clean snap back to the start (like Pink's tail).
            const delay = (isPretty && i === 0) ? 1500 : 150;
            this.plueyTimer = setTimeout(step, delay);
        };
        this.plueyTimer = setTimeout(step, 150);
    }

    stopPluey() {
        this.plueyGen++;
        if (this.plueyTimer) {
            clearTimeout(this.plueyTimer);
            this.plueyTimer = null;
        }
        this.plueyActive = null;
    }
    
    typewriterEffect(text, character) {
        this.isTyping = true;
        this.dialogueText.textContent = '* ';
        this.hideAdvanceIndicator();

        // Flowery: while a recorded voice clip is playing, the text renders
        // quickly and silently — the clip is the line's sound.
        const floweryClipPlaying = character === 'flowery' && this.floweryVoicelinePlaying;
        const clipCharDelay = 16;

        // Pink: her mouth flaps at 6fps while she types (handled by a timer,
        // not per-character), plus her sound.
        if (character === 'pink') {
            this.startPinkTalking();
        }

        let i = 0;
        let characterCount = 0; // Track character count for Queen's and Tenna's sound timing
        
        const typeNextChar = () => {
            if (i < text.length) {
                // Check for pause command — &pFrames = a dramatic beat that must be honored
                if (text.slice(i).startsWith('&p')) {
                    const pauseMatch = text.slice(i).match(/&p(\d+)/);
                    if (pauseMatch) {
                        const pauseFrames = parseInt(pauseMatch[1]);
                        const pauseMs = Math.max(200, (pauseFrames / 60) * 1000); // enforce a minimum beat
                        i += pauseMatch[0].length; // Skip the pause command
                        
                        this.currentTypewriterTimeout = setTimeout(typeNextChar, pauseMs);
                        return;
                    }
                }
                
                const char = text[i];
                this.dialogueText.textContent += char;
                
                // Play sound for non-space characters
                if (char !== ' ') {
                    characterCount++;
                    
                    // Pink's sound plays per voiced char; her mouth is animated
                    // separately at 6fps by startPinkTalking().
                    if (character === 'pink') {
                        this.preloader.playPinkDialogueSound();
                    } else if (character === 'queen') {
                        // Queen plays sound every other character
                        if (characterCount % 2 === 0) {
                            this.preloader.playCharacterSound(character);
                        }
                    } else if (character === 'tenna') {
                        // Tenna plays sound every third character
                        if (characterCount % 3 === 0) {
                            this.preloader.playCharacterSound(character);
                        }
                    } else if (character === 'flowery') {
                        // Flowery plays one sound per three letters (Tenna's
                        // rule) — unless a recorded voice clip is the sound.
                        if (!floweryClipPlaying && characterCount % 3 === 0) {
                            this.preloader.playCharacterSound(character);
                        }
                    } else {
                        this.preloader.playCharacterSound(character);
                    }
                }
                
                i++;
                this.currentTypewriterTimeout = setTimeout(typeNextChar, floweryClipPlaying ? clipCharDelay : this.typewriterSpeed);
            } else {
                this.isTyping = false;
                // Pink snaps her mouth shut when she stops speaking.
                if (character === 'pink') this.stopPinkTalk();
                this.stopFloweryVoiceClip();
                this.showAdvanceIndicator();
                // Display minitext after typing is complete
                if (this.pendingMinitext) {
                    this.displayMinitext(this.pendingMinitext);
                    this.pendingMinitext = null;
                }
            }
        };
        
        typeNextChar();
    }
    
    skipTypewriter() {
        if (this.currentTypewriterTimeout) {
            clearTimeout(this.currentTypewriterTimeout);
        }
        
        const dialogue = this.currentDialogues[this.currentDialogueIndex];
        // Remove pause commands from displayed text
        const cleanText = dialogue.text.replace(/&p\d+/g, '');
        this.dialogueText.textContent = '* ' + cleanText;
        this.isTyping = false;
        if (dialogue.character === 'pink') {
            this.stopPinkTalk();
        }
        this.stopFloweryVoiceClip();
        this.showAdvanceIndicator();

        // Display minitext after skipping
        if (this.pendingMinitext) {
            this.displayMinitext(this.pendingMinitext);
            this.pendingMinitext = null;
        }
    }
    
    nextDialogue() {
        if (this.isTyping) return;
        
        this.currentDialogueIndex++;
        if (this.currentDialogueIndex >= this.currentDialogues.length) {
            // If we're mid AI sequence, hand back to the sequence controller
            if (this.waitingForAiDismiss) {
                const resolve = this.waitingForAiDismiss;
                this.waitingForAiDismiss = null;
                resolve();
                return;
            }
            return;
        }
        
        this.displayCurrentDialogue();
    }
    
    playBackgroundMusic(songName) {
        if (songName === 'silence') {
            this.stopBackgroundMusic();
            return;
        }
        
        if (songName === 'continue') {
            // Just continue current song, don't change anything
            return;
        }
        
        // Parse pitch control
        let pitch = 1.0;
        let actualSongName = songName;
        
        if (songName.includes('|pitch:')) {
            const parts = songName.split('|pitch:');
            actualSongName = parts[0];
            pitch = parseFloat(parts[1]);
            
            // Clamp pitch between 0.25 and 4.0
            pitch = Math.max(0.25, Math.min(4.0, pitch));
        }
        
        const songPath = this.availableSongs[actualSongName];
        if (!songPath) {
            // Enforce the song list: an invalid song is treated as "silence",
            // so nothing keeps playing and no unknown track starts.
            console.warn(`Unknown song: ${actualSongName} — treating as silence`);
            this.stopBackgroundMusic();
            return;
        }
        
        this.currentBackgroundSong = actualSongName;
        this.preloader.playMusic(songPath, pitch);
    }
    
    stopBackgroundMusic() {
        this.preloader.stopMusic();
        this.currentBackgroundSong = null;
    }

    fadeOutBackgroundMusic(duration = 800) {
        this.preloader.fadeOutMusic(duration);
        this.currentBackgroundSong = null;
    }

    // Ask people to chip in on Ko-fi, but never more than once a day and only
    // after the NSFW warning has been acknowledged so popups don't stack.
    maybeShowDonatePopup() {
        const seenKey = 'deltarune_donation_seen_v1';
        const today = new Date().toISOString().slice(0, 10);
        try {
            if (localStorage.getItem(seenKey) === today) return;
        } catch (e) {}
        const overlay = document.getElementById('donate-overlay');
        const notNow = document.getElementById('donate-not-now');
        const support = document.getElementById('donate-support');
        if (!overlay || !notNow || !support) return;
        let dismissed = false;
        const show = () => {
            if (dismissed) return;
            overlay.classList.remove('hidden');
            notNow.focus();
        };
        const dismiss = () => {
            dismissed = true;
            overlay.classList.add('hidden');
            try { localStorage.setItem(seenKey, today); } catch (e) {}
        };
        const ok = document.getElementById('warning-ok');
        if (ok) {
            ok.addEventListener('click', () => setTimeout(show, 700));
        } else {
            setTimeout(show, 2500);
        }
        notNow.addEventListener('click', dismiss);
        support.addEventListener('click', () => {
            dismiss();
            const kofi = document.getElementById('kofi-button');
            if (kofi) kofi.click();
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) dismiss();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
                e.preventDefault();
                dismiss();
            }
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.susieDialogue = new SusieDialogue();
    window.susieDialogue.maybeShowDonatePopup();
});