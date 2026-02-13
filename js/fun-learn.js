class FunLearn {
    constructor() {
        this.currentActivity = null;
        this.audioFiles = [];
        this.currentAudioIndex = 0;
        this.audioElement = null;
        this.isPlaying = false;
        this.audioContext = null;
        this.init();
    }
    
    // 检查main对象是否存在
    hasMain() {
        return typeof main !== 'undefined';
    }
    
    // 添加积分
    addPoints(points) {
        if (this.hasMain()) {
            main.addPoints(points);
        } else {
            console.log(`Would add ${points} points`);
        }
    }
    
    // 添加经验
    addExperience(exp) {
        if (this.hasMain()) {
            main.addExperience(exp);
        } else {
            console.log(`Would add ${exp} experience`);
        }
    }
    
    // 添加成就
    addAchievement(achievement) {
        if (this.hasMain()) {
            main.addAchievement(achievement);
        } else {
            console.log(`Would add achievement: ${achievement}`);
        }
    }
    
    // 添加历史记录
    addHistoryRecord(type, content) {
        if (this.hasMain()) {
            main.addHistoryRecord(type, content);
        } else {
            console.log(`Would add history record: ${type} - ${content}`);
        }
    }

    init() {
        this.setupActivities();
        this.setupAudioPlayer();
        this.loadAudioFiles();
        this.initAudioContext();
    }
    
    // 初始化音频上下文
    initAudioContext() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            this.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new this.AudioContext();
        }
    }
    
    // 播放正确音效
    playCorrectSound() {
        if (this.audioContext) {
            try {
                // 创建主振荡器
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 设置音效参数
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.15);
                
                // 设置音量包络
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                // 播放音效
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
            } catch (error) {
                console.error('播放正确音效失败:', error);
            }
        }
    }
    
    // 播放错误音效
    playErrorSound() {
        if (this.audioContext) {
            try {
                // 创建主振荡器
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 设置音效参数
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
                
                // 设置音量包络
                gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                // 播放音效
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
            } catch (error) {
                console.error('播放错误音效失败:', error);
            }
        }
    }

    // 设置活动
    setupActivities() {
        const funLearnSection = document.querySelector('#fun-learn');
        if (funLearnSection) {
            // 为每个活动卡片添加事件监听器
            const activityCards = funLearnSection.querySelectorAll('.activity-card');
            activityCards.forEach(card => {
                const startButton = card.querySelector('.start-activity');
                if (startButton) {
                    const activityName = startButton.getAttribute('data-activity');
                    
                    // 为开始按钮添加点击事件
                    startButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.startActivity(activityName);
                    });
                    
                    // 为卡片本身添加点击事件
                    card.addEventListener('click', () => {
                        this.startActivity(activityName);
                    });
                }
            });
        }
    }

    // 开始活动
    startActivity(activityName) {
        // 关闭之前的活动
        this.closeCurrentActivity();
        
        this.currentActivity = activityName;
        
        // 打开游戏弹窗
        const gameModal = document.getElementById('game-modal');
        const gameModalTitle = document.getElementById('game-modal-title');
        const gameModalBody = document.getElementById('game-modal-body');
        
        if (gameModal && gameModalTitle && gameModalBody) {
            // 设置弹窗标题
            switch (activityName) {
                case 'memory':
                    gameModalTitle.textContent = '记忆卡片游戏';
                    break;
                case 'matching':
                    gameModalTitle.textContent = '单词匹配游戏';
                    break;
                case 'quiz':
                    gameModalTitle.textContent = 'Quiz问题游戏';
                    break;
                case 'speaking':
                    gameModalTitle.textContent = '口语练习';
                    break;
                case 'typing':
                    gameModalTitle.textContent = '打字游戏';
                    break;
                case 'search-and-evacuate':
                    gameModalTitle.textContent = '搜索和撤离游戏';
                    break;
            }
            
            // 清空弹窗内容
            gameModalBody.innerHTML = '';
            
            // 先找到原始的activity-content元素并修改其id
            const originalActivityContent = document.querySelector('#fun-learn .activity-content');
            if (originalActivityContent) {
                originalActivityContent.id = 'original-activity-content';
            }
            
            // 将活动内容渲染到弹窗中
            const activityContent = document.createElement('div');
            activityContent.id = 'activity-content';
            gameModalBody.appendChild(activityContent);
            
            // 显示弹窗
            gameModal.classList.add('active');
            
            // 调用相应的游戏开始方法
            switch (activityName) {
                case 'memory':
                    this.startMemoryGame();
                    break;
                case 'matching':
                    this.startMatchingGame();
                    break;
                case 'quiz':
                    this.startQuizGame();
                    break;
                case 'speaking':
                    this.startSpeakingPractice();
                    break;
                case 'typing':
                    this.startTypingGame();
                    break;
                case 'search-and-evacuate':
                    this.startSearchAndEvacuateGame();
                    break;
            }
            
            // 为关闭按钮添加事件监听器
            const closeBtn = gameModal.querySelector('.close-game-modal');
            if (closeBtn) {
                closeBtn.onclick = () => {
                    this.closeCurrentActivity();
                };
            }
        }
    }
    
    // 关闭当前活动
    closeCurrentActivity() {
        // 暂停音频
        if (this.audioElement && this.isPlaying) {
            this.pauseAudio();
        }
        
        // 清空活动内容
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = '';
        }
        
        // 关闭游戏弹窗
        const gameModal = document.getElementById('game-modal');
        if (gameModal && gameModal.classList.contains('active')) {
            gameModal.classList.remove('active');
        }
        
        // 恢复原始activity-content的id
        const originalActivityContent = document.getElementById('original-activity-content');
        if (originalActivityContent) {
            originalActivityContent.id = 'activity-content';
        }
        
        // 关闭音频播放器
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer && audioPlayer.classList.contains('active')) {
            audioPlayer.classList.remove('active');
        }
        
        this.currentActivity = null;
    }

    // 开始记忆卡片游戏
    startMemoryGame() {
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = `
                <h3>记忆卡片游戏</h3>
                <p>翻转卡片，记忆单词和释义</p>
                <div class="memory-game" id="memory-game">
                    <!-- 记忆卡片将在这里生成 -->
                </div>
                <div class="game-stats">
                    <span>已翻转: <strong id="cards-flipped">0</strong></span>
                    <span>正确率: <strong id="correct-rate">0%</strong></span>
                </div>
                <button class="btn btn-primary" id="restart-memory">重新开始</button>
            `;
            
            this.generateMemoryCards();
            this.setupMemoryGame();
        }
    }

    // 生成记忆卡片
    generateMemoryCards() {
        const memoryGame = document.getElementById('memory-game');
        if (memoryGame) {
            memoryGame.innerHTML = '';
            
            // 检查词汇数据是否存在
            let words = [];
            if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words.slice(0, 10);
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', meaning: '苹果' },
                    { word: 'banana', meaning: '香蕉' },
                    { word: 'cat', meaning: '猫' },
                    { word: 'dog', meaning: '狗' },
                    { word: 'elephant', meaning: '大象' },
                    { word: 'fish', meaning: '鱼' },
                    { word: 'goat', meaning: '山羊' },
                    { word: 'horse', meaning: '马' },
                    { word: 'ice cream', meaning: '冰淇淋' },
                    { word: 'juice', meaning: '果汁' }
                ];
            }
            
            const cards = [];
            
            // 创建单词卡片
            words.forEach(word => {
                cards.push({
                    type: 'word',
                    content: word.word,
                    pair: word.meaning
                });
                cards.push({
                    type: 'meaning',
                    content: word.meaning,
                    pair: word.word
                });
            });
            
            // 打乱卡片
            this.shuffleArray(cards);
            
            // 创建卡片元素
            cards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'memory-card';
                cardElement.dataset.index = index;
                cardElement.dataset.pair = card.pair;
                cardElement.dataset.type = card.type;
                cardElement.innerHTML = `
                    <div class="card-inner">
                        <div class="card-front">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="card-back">
                            <span>${card.content}</span>
                        </div>
                    </div>
                `;
                memoryGame.appendChild(cardElement);
            });
            
            // 添加卡片进入动画
            setTimeout(() => {
                const memoryCards = document.querySelectorAll('.memory-card');
                memoryCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    }, index * 100);
                });
            }, 100);
        }
    }

    // 设置记忆卡片游戏
    setupMemoryGame() {
        const memoryCards = document.querySelectorAll('.memory-card');
        const cardsFlipped = document.getElementById('cards-flipped');
        const correctRate = document.getElementById('correct-rate');
        const restartBtn = document.getElementById('restart-memory');
        
        let flippedCards = [];
        let matchedPairs = 0;
        let totalFlips = 0;
        let correctMatches = 0;
        
        memoryCards.forEach(card => {
            card.addEventListener('click', () => {
                // 如果卡片已经翻转或已经匹配，不处理
                if (card.classList.contains('flipped') || card.classList.contains('matched')) {
                    return;
                }
                
                // 翻转卡片
                card.classList.add('flipped');
                flippedCards.push(card);
                totalFlips++;
                
                // 更新统计
                if (cardsFlipped) {
                    cardsFlipped.textContent = totalFlips;
                }
                
                // 检查是否翻转了两张卡片
                if (flippedCards.length === 2) {
                    const card1 = flippedCards[0];
                    const card2 = flippedCards[1];
                    
                    // 检查是否匹配
                    if (card1.dataset.pair === card2.textContent.trim() || card2.dataset.pair === card1.textContent.trim()) {
                        // 匹配成功
                        card1.classList.add('matched');
                        card2.classList.add('matched');
                        matchedPairs++;
                        correctMatches++;
                        
                        // 增加积分和经验
                        this.addPoints(5);
                        this.addExperience(3);
                        
                        // 检查游戏是否结束
                        if (matchedPairs === 10) {
                            setTimeout(() => {
                                alert('游戏结束！恭喜你完成了所有匹配！');
                                this.addAchievement('memory_master');
                            }, 500);
                        }
                    } else {
                        // 匹配失败，翻回
                        setTimeout(() => {
                            card1.classList.remove('flipped');
                            card2.classList.remove('flipped');
                        }, 1000);
                    }
                    
                    // 重置翻转卡片数组
                    flippedCards = [];
                    
                    // 更新正确率
                    if (correctRate) {
                        const rate = Math.round((correctMatches / (totalFlips / 2)) * 100);
                        correctRate.textContent = `${rate}%`;
                    }
                }
            });
        });
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.generateMemoryCards();
                this.setupMemoryGame();
                if (cardsFlipped) cardsFlipped.textContent = '0';
                if (correctRate) correctRate.textContent = '0%';
            });
        }
    }

    // 开始匹配游戏
    startMatchingGame() {
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = `
                <h3>匹配游戏</h3>
                <p>将单词与正确的释义匹配</p>
                <div class="matching-game" id="matching-game">
                    <div class="words-container" id="words-container">
                        <!-- 单词将在这里生成 -->
                    </div>
                    <div class="meanings-container" id="meanings-container">
                        <!-- 释义将在这里生成 -->
                    </div>
                </div>
                <div class="game-stats">
                    <span>已匹配: <strong id="pairs-matched">0</strong></span>
                    <span>剩余: <strong id="pairs-left">10</strong></span>
                </div>
                <button class="btn btn-primary" id="restart-matching">重新开始</button>
            `;
            
            this.generateMatchingPairs();
            this.setupMatchingGame();
        }
    }

    // 生成匹配对
    generateMatchingPairs() {
        const wordsContainer = document.getElementById('words-container');
        const meaningsContainer = document.getElementById('meanings-container');
        
        if (wordsContainer && meaningsContainer) {
            wordsContainer.innerHTML = '';
            meaningsContainer.innerHTML = '';
            
            // 检查词汇数据是否存在
            let words = [];
            if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words.slice(0, 10);
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', meaning: '苹果' },
                    { word: 'banana', meaning: '香蕉' },
                    { word: 'cat', meaning: '猫' },
                    { word: 'dog', meaning: '狗' },
                    { word: 'elephant', meaning: '大象' },
                    { word: 'fish', meaning: '鱼' },
                    { word: 'goat', meaning: '山羊' },
                    { word: 'horse', meaning: '马' },
                    { word: 'ice cream', meaning: '冰淇淋' },
                    { word: 'juice', meaning: '果汁' }
                ];
            }
            
            const shuffledWords = [...words];
            const shuffledMeanings = words.map(word => word.meaning);
            
            // 打乱
            this.shuffleArray(shuffledWords);
            this.shuffleArray(shuffledMeanings);
            
            // 创建单词元素
            shuffledWords.forEach((word, index) => {
                const wordElement = document.createElement('div');
                wordElement.className = 'matching-item word-item';
                wordElement.dataset.id = index;
                wordElement.dataset.meaning = word.meaning;
                wordElement.textContent = word.word;
                wordsContainer.appendChild(wordElement);
            });
            
            // 创建释义元素
            shuffledMeanings.forEach((meaning, index) => {
                const meaningElement = document.createElement('div');
                meaningElement.className = 'matching-item meaning-item';
                meaningElement.dataset.id = index;
                meaningElement.dataset.meaning = meaning;
                meaningElement.textContent = meaning;
                meaningsContainer.appendChild(meaningElement);
            });
        }
    }

    // 设置匹配游戏
    setupMatchingGame() {
        const wordItems = document.querySelectorAll('.word-item');
        const meaningItems = document.querySelectorAll('.meaning-item');
        const pairsMatched = document.getElementById('pairs-matched');
        const pairsLeft = document.getElementById('pairs-left');
        const restartBtn = document.getElementById('restart-matching');
        
        let selectedWord = null;
        let matched = 0;
        
        wordItems.forEach(word => {
            word.addEventListener('click', () => {
                // 取消之前的选择
                wordItems.forEach(w => w.classList.remove('selected'));
                // 选择当前单词
                word.classList.add('selected');
                selectedWord = word;
            });
        });
        
        meaningItems.forEach(meaning => {
            meaning.addEventListener('click', () => {
                if (selectedWord) {
                    if (selectedWord.dataset.meaning === meaning.dataset.meaning) {
                        // 匹配成功
                        selectedWord.classList.add('matched');
                        meaning.classList.add('matched');
                        matched++;
                        
                        // 增加积分和经验
                        this.addPoints(8);
                        this.addExperience(4);
                        
                        // 更新统计
                        if (pairsMatched) pairsMatched.textContent = matched;
                        if (pairsLeft) pairsLeft.textContent = 10 - matched;
                        
                        // 检查游戏是否结束
                        if (matched === 10) {
                            setTimeout(() => {
                                alert('游戏结束！恭喜你完成了所有匹配！');
                                this.addAchievement('matching_master');
                            }, 500);
                        }
                    } else {
                        // 匹配失败
                        meaning.classList.add('wrong');
                        setTimeout(() => {
                            meaning.classList.remove('wrong');
                        }, 1000);
                    }
                    
                    // 取消选择
                    selectedWord.classList.remove('selected');
                    selectedWord = null;
                }
            });
        });
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.generateMatchingPairs();
                this.setupMatchingGame();
                if (pairsMatched) pairsMatched.textContent = '0';
                if (pairsLeft) pairsLeft.textContent = '10';
            });
        }
    }

    // 开始Quiz游戏
    startQuizGame() {
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = `
                <div class="quiz-game" id="quiz-game">
                    <div class="quiz-header">
                        <h3>Quiz问题游戏</h3>
                        <p>回答问题，测试你的词汇量，挑战你的极限！</p>
                    </div>
                    <div class="quiz-content">
                        <div class="question" id="question">
                            <!-- 问题将在这里生成 -->
                        </div>
                        <div class="options" id="options">
                            <!-- 选项将在这里生成 -->
                        </div>
                        <div class="quiz-timer" id="quiz-timer">
                            <i class="fas fa-clock"></i> <span id="time-left">15</span>秒
                        </div>
                    </div>
                </div>
                <div class="game-stats">
                    <span>问题: <strong id="current-question">1/10</strong></span>
                    <span>得分: <strong id="quiz-score">0</strong></span>
                    <span>连击: <strong id="quiz-combo">0</strong></span>
                </div>
                <div class="btn-group">
                    <button class="btn btn-primary" id="next-question">下一题</button>
                    <button class="btn btn-secondary" id="restart-quiz">重新开始</button>
                    <button class="btn btn-danger" id="quit-quiz">退出游戏</button>
                </div>
            `;
            
            this.currentQuizQuestion = 0;
            this.quizScore = 0;
            this.quizCombo = 0;
            this.quizTimer = null;
            this.timeLeft = 15;
            this.generateQuizQuestion();
            this.setupQuizGame();
        }
    }

    // 生成Quiz问题
    generateQuizQuestion() {
        const questionElement = document.getElementById('question');
        const optionsElement = document.getElementById('options');
        const currentQuestionElement = document.getElementById('current-question');
        const timeLeftElement = document.getElementById('time-left');
        
        if (questionElement && optionsElement) {
            // 检查词汇数据是否存在
            let words = [];
            if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words;
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', meaning: '苹果' },
                    { word: 'banana', meaning: '香蕉' },
                    { word: 'cat', meaning: '猫' },
                    { word: 'dog', meaning: '狗' },
                    { word: 'elephant', meaning: '大象' },
                    { word: 'fish', meaning: '鱼' },
                    { word: 'goat', meaning: '山羊' },
                    { word: 'horse', meaning: '马' },
                    { word: 'ice cream', meaning: '冰淇淋' },
                    { word: 'juice', meaning: '果汁' },
                    { word: 'kite', meaning: '风筝' },
                    { word: 'lion', meaning: '狮子' },
                    { word: 'monkey', meaning: '猴子' },
                    { word: 'notebook', meaning: '笔记本' },
                    { word: 'orange', meaning: '橙子' }
                ];
            }
            
            // 重置计时器
            this.timeLeft = 15;
            if (timeLeftElement) {
                timeLeftElement.textContent = this.timeLeft;
            }
            
            // 清除之前的计时器
            if (this.quizTimer) {
                clearInterval(this.quizTimer);
            }
            
            // 启动新的计时器
            this.quizTimer = setInterval(() => {
                this.timeLeft--;
                if (timeLeftElement) {
                    timeLeftElement.textContent = this.timeLeft;
                }
                
                // 时间到，自动进入下一题
                if (this.timeLeft <= 0) {
                    clearInterval(this.quizTimer);
                    this.quizCombo = 0; // 重置连击
                    this.currentQuizQuestion++;
                    if (this.currentQuizQuestion < 10) {
                        this.generateQuizQuestion();
                        this.setupQuizGame();
                    } else {
                        // 游戏结束
                        this.endQuizGame();
                    }
                }
            }, 1000);
            
            // 随机选择题型
            const questionTypes = ['meaning', 'word', 'spelling'];
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            
            // 选择一个单词
            const word = words[Math.floor(Math.random() * words.length)];
            
            // 根据题型生成问题和选项
            let questionText = '';
            let options = [];
            let correctAnswer = '';
            
            switch (questionType) {
                case 'meaning':
                    // 单词释义题
                    questionText = `<h4>What is the meaning of "${word.word}"?<h4>`;
                    correctAnswer = word.meaning;
                    
                    // 生成干扰选项
                    options = [word.meaning];
                    while (options.length < 4) {
                        const randomWord = words[Math.floor(Math.random() * words.length)];
                        if (randomWord.meaning !== word.meaning && !options.includes(randomWord.meaning)) {
                            options.push(randomWord.meaning);
                        }
                    }
                    break;
                    
                case 'word':
                    // 释义猜单词
                    questionText = `<h4>Which word means "${word.meaning}"?<h4>`;
                    correctAnswer = word.word;
                    
                    // 生成干扰选项
                    options = [word.word];
                    while (options.length < 4) {
                        const randomWord = words[Math.floor(Math.random() * words.length)];
                        if (randomWord.word !== word.word && !options.includes(randomWord.word)) {
                            options.push(randomWord.word);
                        }
                    }
                    break;
                    
                case 'spelling':
                    // 拼写题
                    const misspelledWord = this.generateMisspelledWord(word.word);
                    questionText = `<h4>Which one is the correct spelling?<h4>`;
                    correctAnswer = word.word;
                    
                    // 生成干扰选项
                    options = [word.word, misspelledWord];
                    while (options.length < 4) {
                        const randomWord = words[Math.floor(Math.random() * words.length)];
                        if (randomWord.word !== word.word && !options.includes(randomWord.word)) {
                            options.push(randomWord.word);
                        }
                    }
                    break;
            }
            
            // 打乱选项
            this.shuffleArray(options);
            
            // 更新问题
            questionElement.innerHTML = questionText;
            
            // 更新选项
            optionsElement.innerHTML = '';
            options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'quiz-option';
                optionElement.dataset.correct = option === correctAnswer;
                optionElement.textContent = option;
                optionsElement.appendChild(optionElement);
            });
            
            // 更新当前问题
            if (currentQuestionElement) {
                currentQuestionElement.textContent = `${this.currentQuizQuestion + 1}/10`;
            }
        }
    }
    
    // 生成拼写错误的单词
    generateMisspelledWord(word) {
        // 简单的拼写错误生成逻辑
        if (word.length <= 3) {
            // 对于短单词，交换两个字母
            if (word.length === 3) {
                return word[0] + word[2] + word[1];
            }
            return word;
        } else {
            // 对于长单词，随机删除一个字母或添加一个重复字母
            const random = Math.random();
            if (random < 0.5) {
                // 删除一个随机字母
                const index = Math.floor(Math.random() * word.length);
                return word.slice(0, index) + word.slice(index + 1);
            } else {
                // 添加一个重复字母
                const index = Math.floor(Math.random() * word.length);
                return word.slice(0, index) + word[index] + word.slice(index);
            }
        }
    }
    
    // 结束Quiz游戏
    endQuizGame() {
        // 清除计时器
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
        // 显示游戏结束消息
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            const finalScore = this.quizScore;
            let message = '';
            let emoji = '';
            
            if (finalScore >= 90) {
                message = '太棒了！你是词汇大师！';
                emoji = '🎉';
            } else if (finalScore >= 70) {
                message = '很好！继续努力！';
                emoji = '👍';
            } else if (finalScore >= 50) {
                message = '不错！再接再厉！';
                emoji = '🙂';
            } else {
                message = '加油！多练习会更好！';
                emoji = '💪';
            }
            
            activityContent.innerHTML = `
                <div class="quiz-result">
                    <h3>游戏结束 ${emoji}</h3>
                    <p>${message}</p>
                    <div class="result-stats">
                        <div class="stat-item">
                            <span class="stat-label">最终得分</span>
                            <span class="stat-value">${finalScore}/100</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">最高连击</span>
                            <span class="stat-value">${this.quizCombo}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">完成题目</span>
                            <span class="stat-value">10/10</span>
                        </div>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-primary" id="play-again">再玩一次</button>
                        <button class="btn btn-secondary" id="back-to-menu">返回菜单</button>
                    </div>
                </div>
            `;
            
            // 添加成就
            if (finalScore >= 90) {
                this.addAchievement('quiz_master');
            } else if (finalScore >= 70) {
                this.addAchievement('quiz_pro');
            }
            
            // 添加积分和经验
            this.addPoints(finalScore);
            this.addExperience(Math.floor(finalScore / 10));
            
            // 添加历史记录
            this.addHistoryRecord('quiz', `Quiz游戏得分: ${finalScore}/100`);
            
            // 绑定按钮事件
            const playAgainBtn = document.getElementById('play-again');
            const backToMenuBtn = document.getElementById('back-to-menu');
            
            if (playAgainBtn) {
                playAgainBtn.addEventListener('click', () => {
                    this.startQuizGame();
                });
            }
            
            if (backToMenuBtn) {
                backToMenuBtn.addEventListener('click', () => {
                    this.closeCurrentActivity();
                });
            }
        }
    }

    // 设置Quiz游戏
    setupQuizGame() {
        const options = document.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('next-question');
        const restartBtn = document.getElementById('restart-quiz');
        const quitBtn = document.getElementById('quit-quiz');
        const quizScore = document.getElementById('quiz-score');
        const quizCombo = document.getElementById('quiz-combo');
        
        let selectedOption = null;
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // 取消之前的选择
                options.forEach(o => o.classList.remove('selected'));
                // 选择当前选项
                option.classList.add('selected');
                selectedOption = option;
                
                // 自动判断答案
                if (selectedOption.dataset.correct === 'true') {
                    // 回答正确
                    selectedOption.classList.add('correct');
                    this.quizScore += 10;
                    this.quizCombo++;
                    this.addPoints(10);
                    this.addExperience(5);
                    
                    // 播放正确音效
                    this.playCorrectSound();
                } else {
                    // 回答错误
                    selectedOption.classList.add('wrong');
                    // 显示正确答案
                    options.forEach(o => {
                        if (o.dataset.correct === 'true') {
                            o.classList.add('correct');
                        }
                    });
                    this.quizCombo = 0; // 重置连击
                }
                
                // 更新分数和连击
                if (quizScore) {
                    quizScore.textContent = this.quizScore;
                }
                if (quizCombo) {
                    quizCombo.textContent = this.quizCombo;
                }
                
                // 禁用选项
                options.forEach(o => o.style.pointerEvents = 'none');
                
                // 清除计时器
                if (this.quizTimer) {
                    clearInterval(this.quizTimer);
                }
                
                // 下一题
                setTimeout(() => {
                    this.currentQuizQuestion++;
                    if (this.currentQuizQuestion < 10) {
                        this.generateQuizQuestion();
                        this.setupQuizGame();
                    } else {
                        // 游戏结束
                        this.endQuizGame();
                    }
                }, 1000);
            });
        });
        
        // 隐藏下一题按钮，因为不再需要
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }
        
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                // 清除计时器
                if (this.quizTimer) {
                    clearInterval(this.quizTimer);
                }
                this.startQuizGame();
            });
        }
        
        if (quitBtn) {
            quitBtn.addEventListener('click', () => {
                // 清除计时器
                if (this.quizTimer) {
                    clearInterval(this.quizTimer);
                }
                this.closeCurrentActivity();
            });
        }
    }

    // 开始口语练习
    startSpeakingPractice() {
        main.openAudioPlayer();
        this.loadAudioFiles();
        this.updateAudioList();
    }

    // 开始打单词游戏
    startTypingGame() {
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = `
                <h3>打单词游戏</h3>
                <p>快速输入显示的单词，挑战你的反应速度！</p>
                <div class="game-mode-selector" style="margin-bottom: 20px;">
                    <button class="btn btn-primary mode-btn active" data-mode="normal">普通模式</button>
                    <button class="btn btn-secondary mode-btn" data-mode="extreme">极限挑战</button>
                </div>
                <div class="typing-game" id="typing-game">
                    <div class="word-display" id="word-display">选择模式并点击开始</div>
                    <div class="word-meaning" id="word-meaning" style="margin: 10px 0; color: #666; font-size: 0.9rem;"></div>
                    <input type="text" id="typing-input" class="form-control" placeholder="在这里输入单词..." disabled>
                    <button class="btn btn-primary" id="confirm-word" style="margin-top: 10px;" disabled>确认输入</button>
                    <div class="game-info">
                        <div class="info-item">
                            <span>时间: <strong id="time-left">60</strong>s</span>
                        </div>
                        <div class="info-item">
                            <span>得分: <strong id="typing-score">0</strong></span>
                        </div>
                        <div class="info-item">
                            <span>正确: <strong id="correct-words">0</strong></span>
                        </div>
                        <div class="info-item">
                            <span>错误: <strong id="wrong-words">0</strong></span>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" id="start-typing">开始游戏</button>
                <button class="btn btn-secondary" id="restart-typing" disabled>重新开始</button>
            `;
            
            this.setupTypingGame();
        }
    }

    // 设置打单词游戏
    setupTypingGame() {
        const startBtn = document.getElementById('start-typing');
        const restartBtn = document.getElementById('restart-typing');
        const typingInput = document.getElementById('typing-input');
        const wordDisplay = document.getElementById('word-display');
        const wordMeaning = document.getElementById('word-meaning');
        const confirmBtn = document.getElementById('confirm-word');
        const timeLeft = document.getElementById('time-left');
        const typingScore = document.getElementById('typing-score');
        const correctWords = document.getElementById('correct-words');
        const wrongWords = document.getElementById('wrong-words');
        const modeBtns = document.querySelectorAll('.mode-btn');
        
        // 将游戏状态变量存储为类的属性
        this.typingGameState = {
            gameStarted: false,
            gameMode: 'normal', // normal 或 extreme
            gameTime: 60,
            score: 0,
            correct: 0,
            wrong: 0,
            currentWord: '',
            currentWordMeaning: '',
            timerInterval: null,
            elements: {
                startBtn,
                restartBtn,
                typingInput,
                wordDisplay,
                wordMeaning,
                confirmBtn,
                timeLeft,
                typingScore,
                correctWords,
                wrongWords
            }
        };
        
        const gameState = this.typingGameState;
        
        // 模式选择
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                modeBtns.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                    b.classList.add('btn-secondary');
                });
                // 添加活动状态到当前按钮
                btn.classList.add('active', 'btn-primary');
                btn.classList.remove('btn-secondary');
                // 更新游戏模式
                gameState.gameMode = btn.dataset.mode;
                // 更新显示
                if (gameState.gameMode === 'extreme') {
                    wordDisplay.textContent = '极限挑战模式：打错一个单词游戏结束！';
                    timeLeft.textContent = '无限';
                } else {
                    wordDisplay.textContent = '普通模式：60秒内尽可能多打单词';
                    timeLeft.textContent = '60';
                }
            });
        });
        
        // 开始游戏按钮
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (!gameState.gameStarted) {
                    gameState.gameStarted = true;
                    startBtn.disabled = true;
                    restartBtn.disabled = false;
                    typingInput.disabled = false;
                    confirmBtn.disabled = false;
                    typingInput.focus();
                    
                    // 重置游戏状态
                    gameState.score = 0;
                    gameState.correct = 0;
                    gameState.wrong = 0;
                    gameState.elements.typingScore.textContent = '0';
                    gameState.elements.correctWords.textContent = '0';
                    gameState.elements.wrongWords.textContent = '0';
                    
                    if (gameState.gameMode === 'normal') {
                        // 普通模式：60秒倒计时
                        gameState.gameTime = 60;
                        timeLeft.textContent = gameState.gameTime;
                        
                        // 开始计时器
                        gameState.timerInterval = setInterval(() => {
                            gameState.gameTime--;
                            timeLeft.textContent = gameState.gameTime;
                            
                            if (gameState.gameTime <= 0) {
                                this.endTypingGame();
                            }
                        }, 1000);
                    } else {
                        // 极限挑战模式：时间无限
                        timeLeft.textContent = '无限';
                    }
                    
                    // 生成第一个单词
                    this.generateTypingWord();
                }
            });
        }
        
        // 重新开始按钮
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.endTypingGame();
                this.startTypingGame();
            });
        }
        
        // 确认输入按钮
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (gameState.gameStarted && gameState.currentWord) {
                    this.checkTypingInput();
                }
            });
        }
        
        // 键盘输入处理 - 回车键确认
        if (typingInput) {
            typingInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && gameState.gameStarted) {
                    this.checkTypingInput();
                }
            });
        }
    }
    
    // 检查打字输入
    checkTypingInput() {
        if (this.typingGameState) {
            const gameState = this.typingGameState;
            const input = gameState.elements.typingInput.value;
            
            if (input === gameState.currentWord) {
                // 输入正确
                gameState.correct++;
                gameState.elements.correctWords.textContent = gameState.correct;
                
                // 播放正确音效
                this.playCorrectSound();
                
                // 计算得分
                if (gameState.gameMode === 'extreme') {
                    // 极限模式得分更高
                    gameState.score += 100 + gameState.correct * 10; // 连续正确单词加分
                } else {
                    // 普通模式根据时间计算得分
                    gameState.score += Math.floor(1000 / (61 - gameState.gameTime));
                }
                gameState.elements.typingScore.textContent = gameState.score;
                
                // 生成新单词
                this.generateTypingWord();
                gameState.elements.typingInput.value = '';
            } else {
                // 输入错误
                gameState.wrong++;
                gameState.elements.wrongWords.textContent = gameState.wrong;
                // 播放错误音效
                this.playErrorSound();
                // 显示错误提示
                gameState.elements.wordDisplay.style.color = '#ff4757';
                
                if (gameState.gameMode === 'extreme') {
                    // 极限挑战模式：打错一个单词游戏结束
                    setTimeout(() => {
                        this.endTypingGame();
                    }, 500);
                } else {
                    // 普通模式：继续游戏
                    setTimeout(() => {
                        gameState.elements.wordDisplay.style.color = '';
                    }, 500);
                }
            }
        }
    }

    // 生成打单词游戏的单词
    generateTypingWord() {
        if (this.typingGameState) {
            const gameState = this.typingGameState;
            
            // 检查词汇数据是否存在
            let words = [];
            if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words;
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', meaning: '苹果' },
                    { word: 'banana', meaning: '香蕉' },
                    { word: 'cat', meaning: '猫' },
                    { word: 'dog', meaning: '狗' },
                    { word: 'elephant', meaning: '大象' },
                    { word: 'fish', meaning: '鱼' },
                    { word: 'goat', meaning: '山羊' },
                    { word: 'horse', meaning: '马' },
                    { word: 'ice cream', meaning: '冰淇淋' },
                    { word: 'juice', meaning: '果汁' },
                    { word: 'kite', meaning: '风筝' },
                    { word: 'lion', meaning: '狮子' },
                    { word: 'monkey', meaning: '猴子' },
                    { word: 'notebook', meaning: '笔记本' },
                    { word: 'orange', meaning: '橙子' }
                ];
            }
            
            // 从词汇库中随机选择一个单词
            const randomIndex = Math.floor(Math.random() * words.length);
            const selectedWord = words[randomIndex];
            gameState.currentWord = selectedWord.word;
            gameState.currentWordMeaning = selectedWord.meaning;
            
            if (gameState.elements.wordDisplay) {
                gameState.elements.wordDisplay.textContent = gameState.currentWord;
                // 添加单词出现的动画
                gameState.elements.wordDisplay.style.transform = 'scale(0.8)';
                gameState.elements.wordDisplay.style.opacity = '0';
                setTimeout(() => {
                    gameState.elements.wordDisplay.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                    gameState.elements.wordDisplay.style.transform = 'scale(1)';
                    gameState.elements.wordDisplay.style.opacity = '1';
                }, 50);
            }
            
            // 显示单词意思
            if (gameState.elements.wordMeaning) {
                gameState.elements.wordMeaning.textContent = `意思: ${gameState.currentWordMeaning}`;
                // 添加意思出现的动画
                gameState.elements.wordMeaning.style.opacity = '0';
                setTimeout(() => {
                    gameState.elements.wordMeaning.style.transition = 'opacity 0.3s ease-in-out';
                    gameState.elements.wordMeaning.style.opacity = '1';
                }, 100);
            }
        }
    }

    // 结束打单词游戏
    endTypingGame() {
        if (this.typingGameState) {
            const gameState = this.typingGameState;
            gameState.gameStarted = false;
            clearInterval(gameState.timerInterval);
            gameState.elements.typingInput.disabled = true;
            gameState.elements.confirmBtn.disabled = true;
            gameState.elements.startBtn.disabled = true;
            
            // 显示游戏结束信息
            setTimeout(() => {
                let message;
                if (gameState.gameMode === 'extreme') {
                    message = `极限挑战结束！\n连续正确单词: ${gameState.correct}\n得分: ${gameState.score}\n\n${gameState.correct >= 10 ? '太棒了！你是真正的打字高手！' : gameState.correct >= 5 ? '不错的成绩，继续加油！' : '继续练习，你会越来越好的！'}`;
                } else {
                    message = `游戏结束！\n得分: ${gameState.score}\n正确单词: ${gameState.correct}\n错误单词: ${gameState.wrong}\n\n你的打字速度: ${Math.round(gameState.correct / 1)} 词/分钟`;
                }
                
                alert(message);
                
                // 添加经验值
                this.addExperience(gameState.correct * 2);
                this.addPoints(gameState.score);
                
                // 添加学习历史记录
                const modeText = gameState.gameMode === 'extreme' ? '极限挑战' : '普通模式';
                this.addHistoryRecord('趣味学习', `完成了打单词游戏(${modeText})，得分: ${gameState.score}`);
            }, 500);
        }
    }

    // 加载音频文件
    loadAudioFiles() {
        // 这里可以根据实际音频文件进行调整
        this.audioFiles = [
            // 原有的口语练习音频
            '大一轮复习讲义（话题版）语境 1(1).mp3',
            '大一轮复习讲义（话题版）语境 3(1).mp3',
            '大一轮复习讲义（话题版）语境 4(1).mp3',
            '大一轮复习讲义（话题版）语境 5(1).mp3',
            '大一轮复习讲义（话题版）语境 6(1).mp3',
            '大一轮复习讲义（话题版）语境 7(1).mp3',
            '大一轮复习讲义（话题版）语境 8(1).mp3',
            '大一轮复习讲义（话题版）语境 9(1).mp3',
            '大一轮复习讲义（话题版）语境 10(1).mp3',
            '大一轮复习讲义（话题版）语境 33(1).mp3',
            '大一轮复习讲义（话题版）语境 34(1).mp3',
            // 听力文件夹中的音频
            '1-201403.mp3',
            '2-  2014年9月.mp3',
            '3-(2015年3月).mp3',
            '4-(2015年9月).mp3',
            '5 2014年高考湖北卷听力（.mp3',
            '6-2016年全国卷I.mp3',
            '7-2016年全国卷Ⅱ.mp3',
            '8-2016浙江卷10月.mp3',
            '9-（2016年3月全国二级）.mp3',
            '10-（16年9月全国二级）.mp3',
            '2018(15)(听力).mp3',
            '2018年（16）.mp3',
            '2018年（17）.mp3',
            '2018年（18）.mp3',
            '2018（19）.mp3',
            '2020高考英语听力音频（全国卷II,III）(1).mp3',
            '21--2019年3月贵州高考听力音频(1).mp3',
            '22-2019年全国Ⅰ卷（主播：男Kristopher Chung和女Tushka Bergen）.mp3',
            '23 2019年全国II卷Ⅲ卷（主播：男Kristopher Chung和女Tushka Bergen）.mp3',
            '24  2019年浙江卷（音频）.mp3',
            '25-2020年全国II卷Ⅲ卷(1).mp3',
            '26-2020年高考全国卷英语听力试题 第一套卷：适用河南、山西(1).mp3',
            '27-2020年1月8日山东新高考英语听力真题音频（第二次）(1).mp3',
            '28-2020年山东卷-高考英语听力真题（含MP3）(1).mp3',
            '听力训练11 全国1卷(1).mp3',
            '听力训练12 （2017年全国2卷）.mp3',
            '听力训练13（浙江卷）.mp3',
            '听力训练14（北京卷）.mp3',
            '听力训练29 2021年英语全国甲、乙卷听力(1).mp3',
            '英语听力3(1).mp3'
        ];
    }

    // 设置音频播放器
    setupAudioPlayer() {
        const audioPlay = document.getElementById('audio-play');
        const audioPrev = document.getElementById('audio-prev');
        const audioNext = document.getElementById('audio-next');
        const audioProgress = document.getElementById('audio-progress');
        const audioSpeed = document.getElementById('audio-speed');
        const audioLoop = document.getElementById('audio-loop');
        const audioTitle = document.getElementById('audio-title');
        const audioTime = document.getElementById('audio-time');
        const audioList = document.getElementById('audio-list');
        const audioHeader = document.getElementById('audio-header');
        
        // 创建音频元素
        this.audioElement = new Audio();
        
        // 点击蓝色区域自动弹出/收回
        if (audioHeader) {
            audioHeader.addEventListener('click', () => {
                const audioPlayer = document.getElementById('audio-player');
                if (audioPlayer.classList.contains('active')) {
                    audioPlayer.classList.remove('active');
                } else {
                    audioPlayer.classList.add('active');
                }
            });
        }
        
        // 播放/暂停按钮
        if (audioPlay) {
            audioPlay.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pauseAudio();
                } else {
                    this.playAudio();
                }
            });
        }
        
        // 上一曲
        if (audioPrev) {
            audioPrev.addEventListener('click', () => {
                this.currentAudioIndex = (this.currentAudioIndex - 1 + this.audioFiles.length) % this.audioFiles.length;
                this.loadAudio();
                this.playAudio();
            });
        }
        
        // 下一曲
        if (audioNext) {
            audioNext.addEventListener('click', () => {
                this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audioFiles.length;
                this.loadAudio();
                this.playAudio();
            });
        }
        
        // 进度条
        if (audioProgress) {
            audioProgress.addEventListener('input', () => {
                if (this.audioElement) {
                    const progress = audioProgress.value;
                    this.audioElement.currentTime = (progress / 100) * this.audioElement.duration;
                }
            });
        }
        
        // 播放速度
        if (audioSpeed) {
            audioSpeed.addEventListener('change', () => {
                if (this.audioElement) {
                    this.audioElement.playbackRate = parseFloat(audioSpeed.value);
                }
            });
        }
        
        // 循环播放
        if (audioLoop) {
            audioLoop.addEventListener('change', () => {
                if (this.audioElement) {
                    this.audioElement.loop = audioLoop.checked;
                }
            });
        }
        
        // 音频时间更新
        if (this.audioElement) {
            this.audioElement.addEventListener('timeupdate', () => {
                if (audioProgress && audioTime && !isNaN(this.audioElement.duration)) {
                    const currentTime = this.audioElement.currentTime;
                    const duration = this.audioElement.duration;
                    const progress = (currentTime / duration) * 100;
                    audioProgress.value = progress;
                    
                    // 更新时间显示
                    const currentMinutes = Math.floor(currentTime / 60);
                    const currentSeconds = Math.floor(currentTime % 60);
                    const durationMinutes = Math.floor(duration / 60);
                    const durationSeconds = Math.floor(duration % 60);
                    
                    audioTime.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
                }
            });
        }
        
        // 音频结束
        if (this.audioElement) {
            this.audioElement.addEventListener('ended', () => {
                this.isPlaying = false;
                if (audioPlay) {
                    audioPlay.innerHTML = '<i class="fas fa-play"></i>';
                }
                
                // 自动播放下一曲
                if (!this.audioElement.loop) {
                    this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audioFiles.length;
                    this.loadAudio();
                    this.playAudio();
                }
            });
        }
    }

    // 加载音频
    loadAudio() {
        if (this.audioElement && this.audioFiles[this.currentAudioIndex]) {
            const audioFile = this.audioFiles[this.currentAudioIndex];
            const audioPath = `audio/${audioFile}`;
            
            this.audioElement.src = audioPath;
            
            // 更新音频标题
            const audioTitle = document.getElementById('audio-title');
            if (audioTitle) {
                audioTitle.textContent = audioFile;
            }
            
            // 更新音频列表选择
            this.updateAudioListSelection();
        }
    }

    // 播放音频
    playAudio() {
        if (!this.audioElement.src) {
            this.loadAudio();
        }
        
        this.audioElement.play().then(() => {
            this.isPlaying = true;
            const audioPlay = document.getElementById('audio-play');
            if (audioPlay) {
                audioPlay.innerHTML = '<i class="fas fa-pause"></i>';
            }
        }).catch(error => {
            console.error('Error playing audio:', error);
            alert('音频播放失败，请检查文件路径是否正确。');
        });
    }

    // 开始搜打撤英语学习游戏
    startSearchAndEvacuateGame() {
        const activityContent = document.getElementById('activity-content');
        if (activityContent) {
            activityContent.innerHTML = `
                <h3>搜打撤英语学习游戏</h3>
                <p>搜索单词、快速输入、完成任务、成功撤离！</p>
                <div class="search-evacuate-game" id="search-evacuate-game">
                    <div class="game-mode-selection" id="game-mode-selection">
                        <h4>选择游戏模式</h4>
                        <div class="mode-options">
                            <button class="btn btn-primary mode-btn" data-mode="standard">标准模式</button>
                            <button class="btn btn-secondary mode-btn" data-mode="survival">生存模式</button>
                            <button class="btn btn-secondary mode-btn" data-mode="challenge">挑战模式</button>
                            <button class="btn btn-secondary mode-btn" data-mode="speed">速度模式</button>
                            <button class="btn btn-secondary mode-btn" data-mode="endless">无尽模式</button>
                            <button class="btn btn-secondary mode-btn" data-mode="theme">主题模式</button>
                            <button class="btn btn-danger back-btn" id="back-from-mode">返回</button>
                        </div>
                        <p class="game-description">
                            标准模式：经典玩法，完成任务后撤离<br>
                            生存模式：生命值有限，挑战极限生存时间<br>
                            挑战模式：特殊任务，更高难度和奖励<br>
                            速度模式：时间有限，挑战最快完成速度<br>
                            无尽模式：没有时间限制，挑战无限波敌人<br>
                            主题模式：按特定主题分类的单词挑战
                        </p>
                    </div>
                    <div class="game-start" id="game-start" style="display: none;">
                        <h4>选择难度</h4>
                        <div class="difficulty-options">
                            <button class="btn btn-primary difficulty-btn" data-difficulty="easy">简单</button>
                            <button class="btn btn-secondary difficulty-btn" data-difficulty="medium">中等</button>
                            <button class="btn btn-secondary difficulty-btn" data-difficulty="hard">困难</button>
                            <button class="btn btn-secondary difficulty-btn" data-difficulty="expert">专家</button>
                            <button class="btn btn-secondary difficulty-btn" data-difficulty="nightmare">噩梦</button>
                            <button class="btn btn-danger back-btn" id="back-from-difficulty">返回</button>
                        </div>
                        <p class="game-description">
                            简单：单词简单，时间充足<br>
                            中等：单词适中，时间紧张<br>
                            困难：单词较难，时间紧迫<br>
                            专家：单词复杂，时间极短<br>
                            噩梦：单词超长，几乎没有时间
                        </p>
                    </div>
                    <div class="game-main" id="game-main" style="display: none;">
                        <div class="game-header">
                            <div class="game-stats">
                                <span>金币: <strong id="game-gold">0</strong></span>
                                <span>任务: <strong id="game-task">0/10</strong></span>
                                <span>时间: <strong id="game-time">60</strong>s</span>
                                <span>生命值: <strong id="game-health">100</strong></span>
                            </div>
                            <div class="game-controls">
                                <button class="btn btn-secondary" id="open-market">市场</button>
                                <button class="btn btn-secondary" id="open-backpack">背包</button>
                                <button class="btn btn-info" id="show-leaderboard">排行榜</button>
                                <button class="btn btn-danger" id="start-evacuation">开始撤离</button>
                            </div>
                        </div>
                        <div class="enemies-area" id="enemies-area">
                            <h4>敌人</h4>
                            <div class="enemies-container" id="enemies-container">
                                <!-- 敌人将在这里生成 -->
                            </div>
                        </div>
                        <div class="search-area">
                            <h4>搜索目标</h4>
                            <div class="target-word" id="target-word">
                                <div class="word-info">
                                    <span class="word" id="current-target-word">Loading...</span>
                                    <span class="part-of-speech" id="current-pos">Loading...</span>
                                </div>
                                <div class="word-details">
                                    <p class="meaning" id="current-meaning">Loading...</p>
                                    <p class="example" id="current-example">Loading...</p>
                                </div>
                            </div>
                        </div>
                        <div class="typing-area">
                            <h4>输入单词</h4>
                            <input type="text" id="typing-input" class="form-control" placeholder="在这里输入单词..." disabled>
                            <button class="btn btn-primary" id="confirm-word" disabled>确认输入</button>
                            <div class="feedback" id="feedback"></div>
                        </div>
                    </div>
                    <div class="market" id="market" style="display: none;">
                        <h4>市场</h4>
                        <div class="market-items" id="market-items">
                            <!-- 市场物品将在这里生成 -->
                        </div>
                        <button class="btn btn-secondary" id="close-market">关闭市场</button>
                    </div>
                    <div class="backpack" id="backpack" style="display: none;">
                        <h4>背包</h4>
                        <div class="backpack-items" id="backpack-items">
                            <!-- 背包物品将在这里生成 -->
                        </div>
                        <button class="btn btn-secondary" id="close-backpack">关闭背包</button>
                    </div>
                    <div class="game-over" id="game-over" style="display: none;">
                        <h4 id="game-result">游戏结束</h4>
                        <div class="game-stats">
                            <span>获得金币: <strong id="final-gold">0</strong></span>
                            <span>完成任务: <strong id="final-tasks">0/10</strong></span>
                            <span>正确单词: <strong id="final-correct">0</strong></span>
                            <span>错误单词: <strong id="final-wrong">0</strong></span>
                        </div>
                        <div class="achievements-section" id="achievements-section">
                            <h5>本次游戏获得的成就</h5>
                            <div class="unlocked-achievements" id="unlocked-achievements">
                                <!-- 成就将在这里显示 -->
                            </div>
                        </div>
                        <button class="btn btn-primary" id="restart-game">重新开始</button>
                        <button class="btn btn-secondary" id="exit-game">退出游戏</button>
                    </div>
                </div>
            `;
            
            this.setupSearchAndEvacuateGame();
        }
    }

    // 设置搜打撤游戏
    setupSearchAndEvacuateGame() {
        const gameModeSelection = document.getElementById('game-mode-selection');
        const modeBtns = document.querySelectorAll('.mode-btn');
        const gameStart = document.getElementById('game-start');
        const gameMain = document.getElementById('game-main');
        const gameOver = document.getElementById('game-over');
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        const market = document.getElementById('market');
        const backpack = document.getElementById('backpack');
        const openMarketBtn = document.getElementById('open-market');
        const closeMarketBtn = document.getElementById('close-market');
        const openBackpackBtn = document.getElementById('open-backpack');
        const closeBackpackBtn = document.getElementById('close-backpack');
        const startEvacuationBtn = document.getElementById('start-evacuation');
        const typingInput = document.getElementById('typing-input');
        const confirmWordBtn = document.getElementById('confirm-word');
        const targetWord = document.getElementById('current-target-word');
        const currentPos = document.getElementById('current-pos');
        const currentMeaning = document.getElementById('current-meaning');
        const currentExample = document.getElementById('current-example');
        const feedback = document.getElementById('feedback');
        const gameGold = document.getElementById('game-gold');
        const gameTask = document.getElementById('game-task');
        const gameTime = document.getElementById('game-time');
        const gameHealth = document.getElementById('game-health');
        const marketItems = document.getElementById('market-items');
        const backpackItems = document.getElementById('backpack-items');
        const gameResult = document.getElementById('game-result');
        const finalGold = document.getElementById('final-gold');
        const finalTasks = document.getElementById('final-tasks');
        const finalCorrect = document.getElementById('final-correct');
        const finalWrong = document.getElementById('final-wrong');
        const restartGameBtn = document.getElementById('restart-game');
        const exitGameBtn = document.getElementById('exit-game');
        
        // 游戏状态
        this.searchEvacuateGameState = {
            gameStarted: false,
            gameOver: false,
            gameMode: 'standard',
            difficulty: 'easy',
            gold: 0,
            tasksCompleted: 0,
            totalTasks: 10,
            gameTime: 60,
            health: 100,
            correctWords: 0,
            wrongWords: 0,
            currentWord: '',
            currentWordData: {},
            backpack: [],
            marketItems: [
                // 基础道具
                { id: 1, name: '时间增加', price: 50, effect: 'time', value: 10 },
                { id: 2, name: '生命值恢复', price: 30, effect: 'health', value: 20 },
                { id: 3, name: '任务加速', price: 100, effect: 'task', value: 1 },
                { id: 4, name: '金币翻倍', price: 200, effect: 'gold', value: 2 },
                
                // 敌人相关道具
                { id: 5, name: '敌人探测器', price: 80, effect: 'enemy_detection', value: 1, description: '显示敌人的到来' },
                { id: 6, name: '敌人减速', price: 120, effect: 'enemy_slow', value: 2, description: '减慢敌人的移动速度' },
                { id: 7, name: '敌人驱散', price: 250, effect: 'enemy_clear', value: 1, description: '立即清除所有敌人' },
                { id: 8, name: '敌人削弱', price: 150, effect: 'enemy_weak', value: 2, description: '削弱敌人的攻击力' },
                { id: 9, name: '敌人陷阱', price: 200, effect: 'enemy_trap', value: 1, description: '使敌人暂时无法移动' },
                
                // 能力增强道具
                { id: 10, name: '精准输入', price: 150, effect: 'accuracy_boost', value: 1, description: '减少输入错误的惩罚' },
                { id: 11, name: '快速思考', price: 180, effect: 'speed_boost', value: 1, description: '增加单词出现的速度' },
                { id: 12, name: '幸运金币', price: 220, effect: 'luck_boost', value: 1, description: '增加击败敌人获得的金币' },
                { id: 13, name: '反应加速', price: 160, effect: 'reaction_boost', value: 1, description: '提高输入响应速度' },
                { id: 14, name: '记忆增强', price: 190, effect: 'memory_boost', value: 1, description: '延长单词显示时间' },
                
                // 特殊效果道具
                { id: 15, name: '无敌护盾', price: 300, effect: 'invincibility', value: 5, description: '5秒内无敌' },
                { id: 16, name: '时间冻结', price: 350, effect: 'time_freeze', value: 3, description: '冻结时间3秒' },
                { id: 17, name: '紧急撤离', price: 400, effect: 'emergency_evacuation', value: 1, description: '立即开始撤离' },
                { id: 18, name: '全面强化', price: 500, effect: 'full_boost', value: 1, description: '所有属性暂时强化' },
                { id: 19, name: '单词护盾', price: 250, effect: 'word_shield', value: 3, description: '单词错误不扣血' },
                
                // 攻击性道具
                { id: 20, name: '单词导弹', price: 180, effect: 'word_missile', value: 1, description: '自动击败一个敌人' },
                { id: 21, name: '范围攻击', price: 280, effect: 'area_attack', value: 1, description: '击败所有普通敌人' },
                { id: 22, name: 'Boss克星', price: 450, effect: 'boss_killer', value: 1, description: '大幅削弱Boss生命值' },
                
                // 防御性道具
                { id: 23, name: '生命护盾', price: 200, effect: 'health_shield', value: 50, description: '吸收伤害的护盾' },
                { id: 24, name: '时间护盾', price: 220, effect: 'time_shield', value: 5, description: '时间减少时触发保护' },
                { id: 25, name: '金币护盾', price: 180, effect: 'gold_shield', value: 1, description: '防止金币被偷' },
                
                // 辅助性道具
                { id: 26, name: '经验加成', price: 250, effect: 'exp_boost', value: 2, description: '增加获得的经验值' },
                { id: 27, name: '成就加速', price: 300, effect: 'achievement_boost', value: 1, description: '增加成就进度' },
                { id: 28, name: '游戏记录', price: 150, effect: 'game_record', value: 1, description: '保存当前游戏进度' },
                { id: 29, name: '市场折扣', price: 200, effect: 'market_discount', value: 0.8, description: '市场道具八折' },
                { id: 30, name: '随机奖励', price: 100, effect: 'random_reward', value: 1, description: '获得随机奖励' }
            ],
            goldMultiplier: 1,
            timerInterval: null,
            evacuationTimer: null,
            achievements: [],
            achievementsUnlocked: [],
            enemies: [],
            enemySpawnInterval: null,
            elements: {
                gameModeSelection,
                gameStart,
                gameMain,
                gameOver,
                typingInput,
                confirmWordBtn,
                targetWord,
                currentPos,
                currentMeaning,
                currentExample,
                feedback,
                gameGold,
                gameTask,
                gameTime,
                gameHealth,
                marketItems,
                backpackItems,
                gameResult,
                finalGold,
                finalTasks,
                finalCorrect,
                finalWrong
            }
        };
        
        const gameState = this.searchEvacuateGameState;
        
        // 游戏模式选择
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                modeBtns.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                    b.classList.add('btn-secondary');
                });
                // 添加活动状态到当前按钮
                btn.classList.add('active', 'btn-primary');
                btn.classList.remove('btn-secondary');
                // 更新游戏模式
                gameState.gameMode = btn.dataset.mode;
                
                // 显示难度选择
                gameState.elements.gameModeSelection.style.display = 'none';
                gameState.elements.gameStart.style.display = 'block';
            });
        });
        
        // 返回按钮事件
        const backFromModeBtn = document.getElementById('back-from-mode');
        if (backFromModeBtn) {
            backFromModeBtn.addEventListener('click', () => {
                // 关闭当前游戏，返回趣味学习主界面
                this.closeCurrentActivity();
            });
        }
        
        const backFromDifficultyBtn = document.getElementById('back-from-difficulty');
        if (backFromDifficultyBtn) {
            backFromDifficultyBtn.addEventListener('click', () => {
                // 返回到游戏模式选择
                gameState.elements.gameStart.style.display = 'none';
                gameState.elements.gameModeSelection.style.display = 'block';
            });
        }
        
        // 难度选择
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                difficultyBtns.forEach(b => {
                    b.classList.remove('active', 'btn-primary');
                    b.classList.add('btn-secondary');
                });
                // 添加活动状态到当前按钮
                btn.classList.add('active', 'btn-primary');
                btn.classList.remove('btn-secondary');
                // 更新难度
                gameState.difficulty = btn.dataset.difficulty;
                
                // 根据难度设置游戏参数
                switch (gameState.difficulty) {
                    case 'easy':
                        gameState.gameTime = 120;
                        gameState.totalTasks = 8;
                        break;
                    case 'medium':
                        gameState.gameTime = 90;
                        gameState.totalTasks = 10;
                        break;
                    case 'hard':
                        gameState.gameTime = 60;
                        gameState.totalTasks = 12;
                        break;
                    case 'expert':
                        gameState.gameTime = 45;
                        gameState.totalTasks = 15;
                        break;
                    case 'nightmare':
                        gameState.gameTime = 30;
                        gameState.totalTasks = 20;
                        break;
                }
                
                // 开始游戏
                gameState.gameStarted = true;
                gameState.elements.gameStart.style.display = 'none';
                gameState.elements.gameMain.style.display = 'block';
                
                // 初始化游戏
                this.initSearchAndEvacuateGame();
            });
        });
        
        // 初始化游戏
        this.initSearchAndEvacuateGame = function() {
            // 重置游戏状态
            gameState.gold = 0;
            gameState.tasksCompleted = 0;
            gameState.health = 100;
            gameState.correctWords = 0;
            gameState.wrongWords = 0;
            gameState.backpack = [];
            gameState.goldMultiplier = 1;
            gameState.achievementsUnlocked = [];
            
            // 初始化成就列表
            gameState.achievements = [
                // 基础成就
                { id: 'first_game', name: '初次尝试', description: '完成第一次游戏', condition: { type: 'game_completed', value: 1 } },
                { id: 'first_success', name: '初次成功', description: '第一次成功撤离', condition: { type: 'successful_evacuations', value: 1 } },
                { id: 'word_master', name: '单词大师', description: '累计正确输入100个单词', condition: { type: 'total_correct_words', value: 100 } },
                { id: 'gold_hunter', name: '淘金者', description: '累计获得1000金币', condition: { type: 'total_gold', value: 1000 } },
                { id: 'word_collector', name: '单词收藏家', description: '累计正确输入500个不同的单词', condition: { type: 'unique_words', value: 500 } },
                { id: 'gold_king', name: '金币之王', description: '累计获得5000金币', condition: { type: 'total_gold', value: 5000 } },
                
                // 游戏模式成就
                { id: 'survival_expert', name: '生存专家', description: '在生存模式中存活超过5分钟', condition: { type: 'survival_time', value: 300 } },
                { id: 'survival_legend', name: '生存传奇', description: '在生存模式中存活超过10分钟', condition: { type: 'survival_time', value: 600 } },
                { id: 'speed_demon', name: '速度恶魔', description: '在速度模式中完成所有任务', condition: { type: 'speed_mode_completed', value: 1 } },
                { id: 'speed_king', name: '速度之王', description: '在速度模式中30秒内完成所有任务', condition: { type: 'speed_mode_time', value: 30 } },
                { id: 'challenge_master', name: '挑战大师', description: '在挑战模式中获得500金币', condition: { type: 'challenge_gold', value: 500 } },
                { id: 'challenge_legend', name: '挑战传奇', description: '在挑战模式中获得1000金币', condition: { type: 'challenge_gold', value: 1000 } },
                { id: 'endless_warrior', name: '无尽战士', description: '在无尽模式中存活超过15分钟', condition: { type: 'endless_time', value: 900 } },
                { id: 'theme_master', name: '主题大师', description: '在主题模式中完成所有主题', condition: { type: 'theme_completed', value: 1 } },
                
                // 难度成就
                { id: 'hardcore', name: '硬核玩家', description: '在困难难度下成功撤离', condition: { type: 'hard_difficulty_success', value: 1 } },
                { id: 'expert', name: '专家级玩家', description: '在专家难度下成功撤离', condition: { type: 'expert_difficulty_success', value: 1 } },
                { id: 'nightmare_survivor', name: '噩梦幸存者', description: '在噩梦难度下成功撤离', condition: { type: 'nightmare_difficulty_success', value: 1 } },
                
                // 连续成就
                { id: 'streak_5', name: '五连胜', description: '连续5次成功撤离', condition: { type: 'win_streak', value: 5 } },
                { id: 'streak_10', name: '十连胜', description: '连续10次成功撤离', condition: { type: 'win_streak', value: 10 } },
                { id: 'streak_20', name: '二十连胜', description: '连续20次成功撤离', condition: { type: 'win_streak', value: 20 } },
                
                // 准确率成就
                { id: 'perfect_game', name: '完美游戏', description: '在一局游戏中正确率100%', condition: { type: 'perfect_game', value: 1 } },
                { id: 'perfect_streak', name: '完美连击', description: '连续正确输入50个单词', condition: { type: 'perfect_streak', value: 50 } },
                
                // 隐藏成就
                { id: 'hidden_gem', name: '隐藏宝石', description: '在一局游戏中获得所有类型的道具', condition: { type: 'all_items', value: 1 } },
                { id: 'enemy_slayer', name: '敌人杀手', description: '累计击败1000个敌人', condition: { type: 'total_enemies_defeated', value: 1000 } },
                { id: 'lucky_day', name: '幸运日', description: '在一局游戏中获得3次随机奖励', condition: { type: 'lucky_day', value: 3 } },
                { id: 'speed_typer', name: '光速打字', description: '在1秒内正确输入一个单词', condition: { type: 'speed_typer', value: 1 } }
            ];
            
            // 根据游戏模式设置参数
            switch (gameState.gameMode) {
                case 'standard':
                    // 标准模式：经典玩法
                    break;
                case 'survival':
                    // 生存模式：无限时间，有限生命值
                    gameState.gameTime = 99999;
                    gameState.totalTasks = 99999;
                    break;
                case 'challenge':
                    // 挑战模式：特殊任务，更高奖励
                    gameState.goldMultiplier = 2;
                    break;
                case 'speed':
                    // 速度模式：时间有限，挑战速度
                    gameState.gameTime = 45;
                    gameState.totalTasks = 15;
                    break;
                case 'endless':
                    // 无尽模式：没有时间限制，挑战无限波敌人
                    gameState.gameTime = 99999;
                    gameState.totalTasks = 99999;
                    gameState.health = 150; // 更多生命值
                    gameState.goldMultiplier = 1.5; // 更多金币
                    break;
                case 'theme':
                    // 主题模式：按特定主题分类的单词挑战
                    gameState.gameTime = 75;
                    gameState.totalTasks = 12;
                    gameState.goldMultiplier = 1.2;
                    // 显示主题选择界面
                    this.showThemeSelection();
                    break;
            }
            
            // 更新显示
            gameState.elements.gameGold.textContent = gameState.gold;
            gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
            gameState.elements.gameTime.textContent = gameState.gameTime;
            gameState.elements.gameHealth.textContent = gameState.health;
            
            // 生成第一个目标单词
            this.generateTargetWord();
            
            // 启用输入
            gameState.elements.typingInput.disabled = false;
            gameState.elements.confirmWordBtn.disabled = false;
            gameState.elements.typingInput.focus();
            
            // 开始计时器
            gameState.timerInterval = setInterval(() => {
                gameState.gameTime--;
                gameState.elements.gameTime.textContent = gameState.gameTime;
                
                if (gameState.gameTime <= 0) {
                    // 时间到，游戏结束
                    this.endSearchAndEvacuateGame(false);
                }
            }, 1000);
            
            // 开始敌人生成
            this.startEnemySpawn();
            
            // 开始随机事件
            this.startRandomEvents();
        };
        
        // 开始随机事件
        this.startRandomEvents = function() {
            // 每10-30秒触发一次随机事件
            setInterval(() => {
                if (!gameState.gameOver && gameState.gameStarted) {
                    this.triggerRandomEvent();
                }
            }, Math.random() * 20000 + 10000); // 10-30秒随机间隔
        };
        
        // 显示主题选择界面
        this.showThemeSelection = function() {
            const gameMain = document.getElementById('game-main');
            if (gameMain) {
                gameMain.innerHTML = `
                    <div class="theme-selection">
                        <h4>选择单词主题</h4>
                        <div class="theme-options">
                            <button class="btn btn-primary theme-btn" data-theme="animals">动物</button>
                            <button class="btn btn-secondary theme-btn" data-theme="food">食物</button>
                            <button class="btn btn-secondary theme-btn" data-theme="sports">运动</button>
                            <button class="btn btn-secondary theme-btn" data-theme="travel">旅行</button>
                            <button class="btn btn-secondary theme-btn" data-theme="technology">科技</button>
                            <button class="btn btn-secondary theme-btn" data-theme="nature">自然</button>
                        </div>
                        <p class="game-description">
                            选择一个主题，游戏将只使用该主题相关的单词<br>
                            完成主题挑战可以获得额外奖励！
                        </p>
                    </div>
                `;
                
                // 添加主题选择事件
                const themeBtns = document.querySelectorAll('.theme-btn');
                themeBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const theme = btn.dataset.theme;
                        gameState.currentTheme = theme;
                        this.loadThemeWords(theme);
                        this.initSearchAndEvacuateGame();
                    });
                });
            }
        };
        
        // 加载主题单词
        this.loadThemeWords = function(theme) {
            // 主题单词库
            const themeWords = {
                animals: ['cat', 'dog', 'elephant', 'lion', 'tiger', 'monkey', 'zebra', 'giraffe', 'panda', 'koala'],
                food: ['apple', 'banana', 'orange', 'pizza', 'hamburger', 'pasta', 'rice', 'bread', 'cake', 'icecream'],
                sports: ['football', 'basketball', 'tennis', 'soccer', 'volleyball', 'baseball', 'swimming', 'running', 'cycling', 'boxing'],
                travel: ['airplane', 'train', 'car', 'bus', 'ship', 'hotel', 'airport', 'station', 'beach', 'mountain'],
                technology: ['computer', 'phone', 'internet', 'software', 'hardware', 'keyboard', 'mouse', 'screen', 'printer', 'camera'],
                nature: ['tree', 'flower', 'grass', 'mountain', 'river', 'lake', 'ocean', 'forest', 'desert', 'island']
            };
            
            // 过滤词汇库，只保留主题相关的单词
            if (typeof vocabulary3500 !== 'undefined' && vocabulary3500.words) {
                gameState.themeWords = vocabulary3500.words.filter(word => 
                    themeWords[theme].includes(word.word.toLowerCase())
                );
            } else if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                gameState.themeWords = vocabulary.words.filter(word => 
                    themeWords[theme].includes(word.word.toLowerCase())
                );
            } else {
                // 使用默认单词数据
                gameState.themeWords = [
                    { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', example: 'I eat an apple every day.' },
                    { word: 'banana', phonetic: '/bəˈnɑːnə/', meaning: '香蕉', example: 'Bananas are yellow.' },
                    { word: 'cat', phonetic: '/kæt/', meaning: '猫', example: 'The cat is black.' },
                    { word: 'dog', phonetic: '/dɒɡ/', meaning: '狗', example: 'Dogs are loyal animals.' },
                    { word: 'elephant', phonetic: '/ˈelɪfənt/', meaning: '大象', example: 'Elephants are very big.' }
                ];
            }
        };
        
        // 触发随机事件
        this.triggerRandomEvent = function() {
            const events = [
                // 正面事件
                {
                    name: '金币雨',
                    description: '天上掉下金币！',
                    probability: 0.2,
                    execute: function() {
                        const goldEarned = Math.floor(Math.random() * 50) + 20;
                        gameState.gold += goldEarned;
                        gameState.elements.gameGold.textContent = gameState.gold;
                        gameState.elements.feedback.innerHTML = `<div class="event positive">金币雨！获得 ${goldEarned} 金币！</div>`;
                    }
                },
                {
                    name: '时间奖励',
                    description: '获得额外时间！',
                    probability: 0.15,
                    execute: function() {
                        const timeAdded = Math.floor(Math.random() * 20) + 10;
                        gameState.gameTime += timeAdded;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        gameState.elements.feedback.innerHTML = `<div class="event positive">时间奖励！获得 ${timeAdded} 秒！</div>`;
                    }
                },
                {
                    name: '生命值恢复',
                    description: '生命值完全恢复！',
                    probability: 0.15,
                    execute: function() {
                        gameState.health = 100;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        gameState.elements.feedback.innerHTML = `<div class="event positive">生命值恢复！</div>`;
                    }
                },
                {
                    name: '任务加速',
                    description: '任务进度增加！',
                    probability: 0.1,
                    execute: function() {
                        gameState.tasksCompleted += 1;
                        gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                        gameState.elements.feedback.innerHTML = `<div class="event positive">任务加速！完成度+1！</div>`;
                    }
                },
                
                // 负面事件
                {
                    name: '时间窃贼',
                    description: '时间被偷走了！',
                    probability: 0.15,
                    execute: function() {
                        const timeLost = Math.floor(Math.random() * 15) + 5;
                        gameState.gameTime = Math.max(0, gameState.gameTime - timeLost);
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        gameState.elements.feedback.innerHTML = `<div class="event negative">时间窃贼！失去 ${timeLost} 秒！</div>`;
                    }
                },
                {
                    name: '生命值损失',
                    description: '遭受神秘伤害！',
                    probability: 0.1,
                    execute: function() {
                        const healthLost = Math.floor(Math.random() * 20) + 10;
                        gameState.health = Math.max(0, gameState.health - healthLost);
                        gameState.elements.gameHealth.textContent = gameState.health;
                        gameState.elements.feedback.innerHTML = `<div class="event negative">神秘伤害！失去 ${healthLost} 生命值！</div>`;
                    }
                },
                {
                    name: '敌人大军',
                    description: '敌人突然增多！',
                    probability: 0.15,
                    execute: function() {
                        // 生成额外的敌人
                        for (let i = 0; i < 3; i++) {
                            setTimeout(() => {
                                this.spawnEnemy();
                            }, i * 500);
                        }
                        gameState.elements.feedback.innerHTML = `<div class="event negative">敌人大军！小心应对！</div>`;
                    }.bind(this)
                }
            ];
            
            // 随机选择事件
            const event = this.weightedRandomChoice(events);
            if (event) {
                event.execute();
                
                // 3秒后清除反馈
                setTimeout(() => {
                    gameState.elements.feedback.innerHTML = '';
                }, 3000);
            }
        };
        
        // 加权随机选择
        this.weightedRandomChoice = function(choices) {
            const totalWeight = choices.reduce((sum, choice) => sum + choice.probability, 0);
            let random = Math.random() * totalWeight;
            
            for (const choice of choices) {
                random -= choice.probability;
                if (random <= 0) {
                    return choice;
                }
            }
            
            return choices[choices.length - 1];
        };
        
        // 设置自动保存
        this.setupAutoSave = function() {
            // 每30秒自动保存一次游戏进度
            setInterval(() => {
                if (!gameState.gameOver && gameState.gameStarted) {
                    this.saveGameProgress();
                }
            }, 30000);
        };
        
        // 生成目标单词
        this.generateTargetWord = function() {
            // 检查词汇数据是否存在
            let words = [];
            if (typeof vocabulary3500 !== 'undefined' && vocabulary3500.words) {
                words = vocabulary3500.words;
            } else if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words;
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', example: 'I eat an apple every day.' },
                    { word: 'banana', phonetic: '/bəˈnɑːnə/', meaning: '香蕉', example: 'Bananas are yellow.' },
                    { word: 'cat', phonetic: '/kæt/', meaning: '猫', example: 'The cat is black.' },
                    { word: 'dog', phonetic: '/dɒɡ/', meaning: '狗', example: 'Dogs are loyal animals.' },
                    { word: 'elephant', phonetic: '/ˈelɪfənt/', meaning: '大象', example: 'Elephants are very big.' },
                    { word: 'fish', phonetic: '/fɪʃ/', meaning: '鱼', example: 'Fish live in water.' },
                    { word: 'goat', phonetic: '/ɡəʊt/', meaning: '山羊', example: 'Goats eat grass.' },
                    { word: 'horse', phonetic: '/hɔːs/', meaning: '马', example: 'Horses can run fast.' },
                    { word: 'ice', phonetic: '/aɪs/', meaning: '冰', example: 'Ice is cold.' },
                    { word: 'juice', phonetic: '/dʒuːs/', meaning: '果汁', example: 'I like orange juice.' }
                ];
            }
            
            // 根据主题选择单词
            let selectedWords = words;
            if (gameState.currentTheme && gameState.themeWords && gameState.themeWords.length > 0) {
                selectedWords = gameState.themeWords;
            } else if (gameState.difficulty === 'hard') {
                // 困难模式选择更长的单词
                selectedWords = words.filter(word => word.word.length > 5);
            } else if (gameState.difficulty === 'easy') {
                // 简单模式选择更短的单词
                selectedWords = words.filter(word => word.word.length <= 5);
            }
            
            // 确保有足够的单词
            if (selectedWords.length === 0) {
                selectedWords = words;
            }
            
            // 随机选择一个单词
            const randomIndex = Math.floor(Math.random() * selectedWords.length);
            const selectedWord = selectedWords[randomIndex];
            
            // 更新游戏状态
            gameState.currentWord = selectedWord.word;
            gameState.currentWordData = selectedWord;
            
            // 更新显示
            gameState.elements.targetWord.textContent = selectedWord.word;
            gameState.elements.currentPos.textContent = selectedWord.partOfSpeech || '未知词性';
            gameState.elements.currentMeaning.textContent = `释义: ${selectedWord.meaning}`;
            gameState.elements.currentExample.textContent = `例句: ${selectedWord.example || '无例句'}`;
            
            // 添加单词出现的动画
            gameState.elements.targetWord.style.transform = 'scale(0.8)';
            gameState.elements.targetWord.style.opacity = '0';
            setTimeout(() => {
                gameState.elements.targetWord.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                gameState.elements.targetWord.style.transform = 'scale(1)';
                gameState.elements.targetWord.style.opacity = '1';
            }, 50);
        };
        
        // 确认输入
        confirmWordBtn.addEventListener('click', () => {
            this.checkWordInput();
        });
        
        // 回车键确认
        typingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkWordInput();
            }
        });
        
        // 检查单词输入
        this.checkWordInput = function() {
            const input = gameState.elements.typingInput.value.toLowerCase();
            const correctWord = gameState.currentWord.toLowerCase();
            
            if (input === correctWord) {
                // 输入正确
                gameState.correctWords++;
                gameState.tasksCompleted++;
                
                // 计算金币奖励
                let goldEarned = 10;
                if (gameState.difficulty === 'medium') {
                    goldEarned = 15;
                } else if (gameState.difficulty === 'hard') {
                    goldEarned = 20;
                }
                
                // 根据游戏模式调整奖励
                switch (gameState.gameMode) {
                    case 'survival':
                        // 生存模式：正确输入恢复生命值
                        gameState.health += 5;
                        if (gameState.health > 100) gameState.health = 100;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        break;
                    case 'speed':
                        // 速度模式：正确输入增加时间
                        gameState.gameTime += 2;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        goldEarned += 5; // 额外金币奖励
                        break;
                }
                
                // 应用金币倍数
                goldEarned *= gameState.goldMultiplier;
                gameState.gold += goldEarned;
                
                // 播放正确音效
                this.playCorrectSound();
                
                // 更新显示
                gameState.elements.gameGold.textContent = gameState.gold;
                gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                
                // 根据游戏模式显示不同的反馈
                let feedbackText = `正确！获得 ${goldEarned} 金币！`;
                if (gameState.gameMode === 'survival') {
                    feedbackText = `正确！获得 ${goldEarned} 金币，生命值 +5！`;
                } else if (gameState.gameMode === 'speed') {
                    feedbackText = `正确！获得 ${goldEarned} 金币，时间 +2！`;
                }
                gameState.elements.feedback.textContent = feedbackText;
                gameState.elements.feedback.style.color = '#27ae60';
                
                // 生成新单词
                this.generateTargetWord();
                gameState.elements.typingInput.value = '';
                
                // 检查任务是否完成
                if (gameState.tasksCompleted >= gameState.totalTasks) {
                    // 任务完成，可以撤离
                    gameState.elements.feedback.textContent = '任务完成！可以开始撤离了！';
                    gameState.elements.feedback.style.color = '#3498db';
                }
            } else {
                // 输入错误
                gameState.wrongWords++;
                
                // 根据游戏模式调整惩罚
                let healthLoss = 10;
                if (gameState.gameMode === 'survival') {
                    healthLoss = 15; // 生存模式惩罚更严重
                } else if (gameState.gameMode === 'speed') {
                    healthLoss = 8; // 速度模式惩罚较轻，但时间减少
                    gameState.gameTime -= 3;
                    gameState.elements.gameTime.textContent = gameState.gameTime;
                }
                
                gameState.health -= healthLoss;
                
                // 播放错误音效
                this.playErrorSound();
                
                // 更新显示
                gameState.elements.gameHealth.textContent = gameState.health;
                
                // 根据游戏模式显示不同的反馈
                let feedbackText = `错误！生命值 -${healthLoss}`;
                if (gameState.gameMode === 'speed') {
                    feedbackText = `错误！生命值 -${healthLoss}，时间 -3！`;
                }
                gameState.elements.feedback.textContent = feedbackText;
                gameState.elements.feedback.style.color = '#e74c3c';
                
                // 检查生命值是否为0
                if (gameState.health <= 0) {
                    // 生命值为0，游戏结束
                    this.endSearchAndEvacuateGame(false);
                }
            }
        };
        
        // 打开市场
        openMarketBtn.addEventListener('click', () => {
            this.openMarket();
        });
        
        // 关闭市场
        closeMarketBtn.addEventListener('click', () => {
            market.style.display = 'none';
            gameMain.style.display = 'block';
        });
        
        // 打开背包
        openBackpackBtn.addEventListener('click', () => {
            this.openBackpack();
        });
        
        // 关闭背包
        closeBackpackBtn.addEventListener('click', () => {
            backpack.style.display = 'none';
            gameMain.style.display = 'block';
        });
        
        // 开始撤离
        startEvacuationBtn.addEventListener('click', () => {
            if (gameState.tasksCompleted >= gameState.totalTasks) {
                this.startEvacuation();
            } else {
                gameState.elements.feedback.textContent = '任务未完成，无法撤离！';
                gameState.elements.feedback.style.color = '#f39c12';
            }
        });
        
        // 显示排行榜
        const showLeaderboardBtn = document.getElementById('show-leaderboard');
        if (showLeaderboardBtn) {
            showLeaderboardBtn.addEventListener('click', () => {
                this.showLeaderboard();
            });
        }
        
        // 打开市场
        this.openMarket = function() {
            gameMain.style.display = 'none';
            market.style.display = 'block';
            
            // 生成市场物品
            gameState.elements.marketItems.innerHTML = '';
            gameState.marketItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'market-item';
                itemElement.innerHTML = `
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">${item.price} 金币</span>
                    <button class="btn btn-primary buy-item" data-item-id="${item.id}">购买</button>
                `;
                gameState.elements.marketItems.appendChild(itemElement);
            });
            
            // 添加购买事件
            const buyButtons = document.querySelectorAll('.buy-item');
            buyButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const itemId = parseInt(btn.dataset.itemId);
                    this.buyItem(itemId);
                });
            });
        };
        
        // 购买物品
        this.buyItem = function(itemId) {
            const item = gameState.marketItems.find(i => i.id === itemId);
            if (item) {
                if (gameState.gold >= item.price) {
                    // 购买成功
                    gameState.gold -= item.price;
                    gameState.backpack.push(item);
                    gameState.elements.gameGold.textContent = gameState.gold;
                    
                    // 显示购买成功
                    gameState.elements.feedback.textContent = `购买成功！`;
                    gameState.elements.feedback.style.color = '#27ae60';
                    
                    // 重新打开市场
                    this.openMarket();
                } else {
                    // 金币不足
                    gameState.elements.feedback.textContent = '金币不足！';
                    gameState.elements.feedback.style.color = '#e74c3c';
                }
            }
        };
        
        // 打开背包
        this.openBackpack = function() {
            gameMain.style.display = 'none';
            backpack.style.display = 'block';
            
            // 生成背包物品
            gameState.elements.backpackItems.innerHTML = '';
            if (gameState.backpack.length === 0) {
                gameState.elements.backpackItems.innerHTML = '<p>背包为空</p>';
            } else {
                gameState.backpack.forEach((item, index) => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'backpack-item';
                    itemElement.innerHTML = `
                        <span class="item-name">${item.name}</span>
                        <button class="btn btn-primary use-item" data-item-index="${index}">使用</button>
                        <button class="btn btn-danger remove-item" data-item-index="${index}">丢弃</button>
                    `;
                    gameState.elements.backpackItems.appendChild(itemElement);
                });
                
                // 添加使用事件
                const useButtons = document.querySelectorAll('.use-item');
                useButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const itemIndex = parseInt(btn.dataset.itemIndex);
                        this.useItem(itemIndex);
                    });
                });
                
                // 添加丢弃事件
                const removeButtons = document.querySelectorAll('.remove-item');
                removeButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const itemIndex = parseInt(btn.dataset.itemIndex);
                        gameState.backpack.splice(itemIndex, 1);
                        this.openBackpack();
                    });
                });
            }
        };
        
        // 使用物品
        this.useItem = function(itemIndex) {
            const item = gameState.backpack[itemIndex];
            if (item) {
                // 使用物品效果
                switch (item.effect) {
                    case 'time':
                        gameState.gameTime += item.value;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        gameState.elements.feedback.textContent = `时间 +${item.value}秒`;
                        break;
                    case 'health':
                        gameState.health += item.value;
                        if (gameState.health > 100) {
                            gameState.health = 100;
                        }
                        gameState.elements.gameHealth.textContent = gameState.health;
                        gameState.elements.feedback.textContent = `生命值 +${item.value}`;
                        break;
                    case 'task':
                        gameState.tasksCompleted += item.value;
                        gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                        gameState.elements.feedback.textContent = `任务进度 +${item.value}`;
                        break;
                    case 'gold':
                        gameState.goldMultiplier = item.value;
                        gameState.elements.feedback.textContent = `金币倍数 ×${item.value}`;
                        break;
                    case 'enemy_detection':
                        // 敌人探测器：显示敌人的到来
                        gameState.elements.feedback.textContent = '敌人探测器已激活！';
                        // 这里可以添加敌人检测的视觉效果
                        break;
                    case 'enemy_slow':
                        // 敌人减速：减慢敌人的移动速度
                        gameState.enemies.forEach(enemy => {
                            enemy.speed *= 0.5;
                        });
                        gameState.elements.feedback.textContent = '敌人速度减慢！';
                        break;
                    case 'enemy_clear':
                        // 敌人驱散：立即清除所有敌人
                        const enemyCount = gameState.enemies.length;
                        gameState.enemies = [];
                        this.renderEnemies();
                        gameState.elements.feedback.textContent = `清除了 ${enemyCount} 个敌人！`;
                        break;
                    case 'accuracy_boost':
                        // 精准输入：减少输入错误的惩罚
                        gameState.accuracyBoost = true;
                        gameState.elements.feedback.textContent = '精准输入已激活！';
                        break;
                    case 'speed_boost':
                        // 快速思考：增加单词出现的速度
                        gameState.speedBoost = true;
                        gameState.elements.feedback.textContent = '快速思考已激活！';
                        break;
                    case 'luck_boost':
                        // 幸运金币：增加击败敌人获得的金币
                        gameState.luckBoost = true;
                        gameState.elements.feedback.textContent = '幸运金币已激活！';
                        break;
                    case 'invincibility':
                        // 无敌护盾：5秒内无敌
                        gameState.invincible = true;
                        gameState.elements.feedback.textContent = '无敌护盾已激活！5秒内无敌！';
                        
                        // 添加无敌视觉效果
                        gameState.elements.gameHealth.style.color = '#3498db';
                        gameState.elements.gameHealth.style.fontWeight = 'bold';
                        
                        setTimeout(() => {
                            gameState.invincible = false;
                            gameState.elements.gameHealth.style.color = '';
                            gameState.elements.gameHealth.style.fontWeight = '';
                            gameState.elements.feedback.textContent = '无敌护盾已失效！';
                        }, item.value * 1000);
                        break;
                    case 'time_freeze':
                        // 时间冻结：冻结时间3秒
                        gameState.elements.gameTime.textContent = '冻结中...';
                        const originalGameTime = gameState.gameTime;
                        
                        // 暂停计时器
                        clearInterval(gameState.timerInterval);
                        
                        setTimeout(() => {
                            gameState.gameTime = originalGameTime;
                            gameState.elements.gameTime.textContent = gameState.gameTime;
                            
                            // 重新开始计时器
                            gameState.timerInterval = setInterval(() => {
                                gameState.gameTime--;
                                gameState.elements.gameTime.textContent = gameState.gameTime;
                                
                                if (gameState.gameTime <= 0) {
                                    this.endSearchAndEvacuateGame(false);
                                }
                            }, 1000);
                            
                            gameState.elements.feedback.textContent = '时间冻结已结束！';
                        }, item.value * 1000);
                        
                        gameState.elements.feedback.textContent = `时间冻结已激活！${item.value}秒内时间停止！`;
                        break;
                    case 'emergency_evacuation':
                        // 紧急撤离：立即开始撤离
                        this.startEvacuation();
                        gameState.elements.feedback.textContent = '紧急撤离已激活！立即开始撤离！';
                        break;
                    case 'full_boost':
                        // 全面强化：所有属性暂时强化
                        gameState.accuracyBoost = true;
                        gameState.speedBoost = true;
                        gameState.luckBoost = true;
                        gameState.goldMultiplier = 2;
                        setTimeout(() => {
                            gameState.accuracyBoost = false;
                            gameState.speedBoost = false;
                            gameState.luckBoost = false;
                            gameState.goldMultiplier = 1;
                            gameState.elements.feedback.textContent = '全面强化已结束！';
                        }, 10000);
                        gameState.elements.feedback.textContent = '全面强化已激活！所有属性暂时强化！';
                        break;
                    case 'word_shield':
                        // 单词护盾：单词错误不扣血
                        gameState.wordShield = true;
                        setTimeout(() => {
                            gameState.wordShield = false;
                            gameState.elements.feedback.textContent = '单词护盾已结束！';
                        }, item.value * 1000);
                        gameState.elements.feedback.textContent = `单词护盾已激活！${item.value}秒内单词错误不扣血！`;
                        break;
                    case 'word_missile':
                        // 单词导弹：自动击败一个敌人
                        if (gameState.enemies.length > 0) {
                            const firstEnemy = gameState.enemies[0];
                            gameState.enemies.splice(0, 1);
                            this.renderEnemies();
                            gameState.elements.feedback.textContent = '单词导弹已发射！击败了一个敌人！';
                        } else {
                            gameState.elements.feedback.textContent = '当前没有敌人！';
                        }
                        break;
                    case 'area_attack':
                        // 范围攻击：击败所有普通敌人
                        const normalEnemiesCount = gameState.enemies.filter(enemy => !enemy.isBoss).length;
                        gameState.enemies = gameState.enemies.filter(enemy => enemy.isBoss);
                        this.renderEnemies();
                        gameState.elements.feedback.textContent = `范围攻击已激活！击败了 ${normalEnemiesCount} 个普通敌人！`;
                        break;
                    case 'boss_killer':
                        // Boss克星：大幅削弱Boss生命值
                        gameState.enemies.forEach(enemy => {
                            if (enemy.isBoss) {
                                enemy.health = Math.max(1, enemy.health - 5);
                            }
                        });
                        this.renderEnemies();
                        gameState.elements.feedback.textContent = 'Boss克星已激活！大幅削弱了Boss生命值！';
                        break;
                    case 'health_shield':
                        // 生命护盾：吸收伤害的护盾
                        gameState.healthShield = item.value;
                        gameState.elements.feedback.textContent = `生命护盾已激活！吸收 ${item.value} 点伤害！`;
                        break;
                    case 'time_shield':
                        // 时间护盾：时间减少时触发保护
                        gameState.timeShield = true;
                        setTimeout(() => {
                            gameState.timeShield = false;
                            gameState.elements.feedback.textContent = '时间护盾已结束！';
                        }, 30000);
                        gameState.elements.feedback.textContent = '时间护盾已激活！时间减少时触发保护！';
                        break;
                    case 'gold_shield':
                        // 金币护盾：防止金币被偷
                        gameState.goldShield = true;
                        setTimeout(() => {
                            gameState.goldShield = false;
                            gameState.elements.feedback.textContent = '金币护盾已结束！';
                        }, 30000);
                        gameState.elements.feedback.textContent = '金币护盾已激活！防止金币被偷！';
                        break;
                    case 'exp_boost':
                        // 经验加成：增加获得的经验值
                        gameState.expMultiplier = item.value;
                        setTimeout(() => {
                            gameState.expMultiplier = 1;
                            gameState.elements.feedback.textContent = '经验加成已结束！';
                        }, 30000);
                        gameState.elements.feedback.textContent = `经验加成已激活！经验值 ×${item.value}！`;
                        break;
                    case 'achievement_boost':
                        // 成就加速：增加成就进度
                        gameState.achievementBoost = true;
                        setTimeout(() => {
                            gameState.achievementBoost = false;
                            gameState.elements.feedback.textContent = '成就加速已结束！';
                        }, 30000);
                        gameState.elements.feedback.textContent = '成就加速已激活！增加成就进度！';
                        break;
                    case 'game_record':
                        // 游戏记录：保存当前游戏进度
                        this.saveGameProgress();
                        gameState.elements.feedback.textContent = '游戏进度已保存！';
                        break;
                    case 'market_discount':
                        // 市场折扣：市场道具八折
                        gameState.marketDiscount = item.value;
                        setTimeout(() => {
                            gameState.marketDiscount = 1;
                            gameState.elements.feedback.textContent = '市场折扣已结束！';
                        }, 30000);
                        gameState.elements.feedback.textContent = `市场折扣已激活！所有道具 ${item.value * 100}% 折扣！`;
                        break;
                    case 'random_reward':
                    // 随机奖励：获得随机奖励
                    const rewards = [
                        { type: 'gold', value: Math.floor(Math.random() * 50) + 50 },
                        { type: 'health', value: Math.floor(Math.random() * 30) + 20 },
                        { type: 'time', value: Math.floor(Math.random() * 15) + 10 },
                        { type: 'task', value: 1 }
                    ];
                    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
                    
                    switch (randomReward.type) {
                        case 'gold':
                            gameState.gold += randomReward.value;
                            gameState.elements.gameGold.textContent = gameState.gold;
                            gameState.elements.feedback.textContent = `随机奖励！获得 ${randomReward.value} 金币！`;
                            break;
                        case 'health':
                            gameState.health = Math.min(100, gameState.health + randomReward.value);
                            gameState.elements.gameHealth.textContent = gameState.health;
                            gameState.elements.feedback.textContent = `随机奖励！获得 ${randomReward.value} 生命值！`;
                            break;
                        case 'time':
                            gameState.gameTime += randomReward.value;
                            gameState.elements.gameTime.textContent = gameState.gameTime;
                            gameState.elements.feedback.textContent = `随机奖励！获得 ${randomReward.value} 秒时间！`;
                            break;
                        case 'task':
                            gameState.tasksCompleted += randomReward.value;
                            gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                            gameState.elements.feedback.textContent = `随机奖励！任务进度 +${randomReward.value}！`;
                            break;
                    }
                    break;
                case 'enemy_weak':
                    // 敌人削弱：削弱敌人的攻击力
                    gameState.enemyWeak = true;
                    setTimeout(() => {
                        gameState.enemyWeak = false;
                        gameState.elements.feedback.textContent = '敌人削弱已结束！';
                    }, 30000);
                    gameState.elements.feedback.textContent = '敌人削弱已激活！敌人攻击力降低！';
                    break;
                case 'enemy_trap':
                    // 敌人陷阱：使敌人暂时无法移动
                    gameState.enemyTrapped = true;
                    setTimeout(() => {
                        gameState.enemyTrapped = false;
                        gameState.elements.feedback.textContent = '敌人陷阱已结束！';
                    }, 10000);
                    gameState.elements.feedback.textContent = '敌人陷阱已激活！敌人暂时无法移动！';
                    break;
                case 'reaction_boost':
                    // 反应加速：提高输入响应速度
                    gameState.reactionBoost = true;
                    setTimeout(() => {
                        gameState.reactionBoost = false;
                        gameState.elements.feedback.textContent = '反应加速已结束！';
                    }, 30000);
                    gameState.elements.feedback.textContent = '反应加速已激活！输入响应速度提高！';
                    break;
                case 'memory_boost':
                    // 记忆增强：延长单词显示时间
                    gameState.memoryBoost = true;
                    setTimeout(() => {
                        gameState.memoryBoost = false;
                        gameState.elements.feedback.textContent = '记忆增强已结束！';
                    }, 30000);
                    gameState.elements.feedback.textContent = '记忆增强已激活！单词显示时间延长！';
                    break;
                }
                
                // 从背包中移除物品
                gameState.backpack.splice(itemIndex, 1);
                
                // 重新打开背包
                this.openBackpack();
            }
        };
        
        // 检查成就
        this.checkAchievements = function() {
            // 获取本地存储中的游戏统计数据
            let gameStats = JSON.parse(localStorage.getItem('searchEvacuateGameStats') || '{}');
            
            // 更新游戏统计数据
            gameStats.totalGames = (gameStats.totalGames || 0) + 1;
            gameStats.totalCorrectWords = (gameStats.totalCorrectWords || 0) + gameState.correctWords;
            gameStats.totalGold = (gameStats.totalGold || 0) + gameState.gold;
            
            // 检查游戏模式特定的统计数据
            if (gameState.gameMode === 'survival') {
                const survivalTime = 60 - gameState.gameTime;
                gameStats.survivalTime = Math.max(gameStats.survivalTime || 0, survivalTime);
            } else if (gameState.gameMode === 'speed' && gameState.tasksCompleted >= gameState.totalTasks) {
                gameStats.speedModeCompleted = (gameStats.speedModeCompleted || 0) + 1;
            } else if (gameState.gameMode === 'challenge') {
                gameStats.challengeGold = Math.max(gameStats.challengeGold || 0, gameState.gold);
            }
            
            // 保存游戏统计数据
            localStorage.setItem('searchEvacuateGameStats', JSON.stringify(gameStats));
            
            // 检查每个成就
            gameState.achievements.forEach(achievement => {
                // 跳过已经解锁的成就
                if (gameState.achievementsUnlocked.includes(achievement.id)) {
                    return;
                }
                
                let unlocked = false;
                
                // 根据成就条件检查是否解锁
                switch (achievement.condition.type) {
                    case 'game_completed':
                        unlocked = gameStats.totalGames >= achievement.condition.value;
                        break;
                    case 'successful_evacuations':
                        unlocked = (gameStats.successfulEvacuations || 0) >= achievement.condition.value;
                        break;
                    case 'total_correct_words':
                        unlocked = gameStats.totalCorrectWords >= achievement.condition.value;
                        break;
                    case 'total_gold':
                        unlocked = gameStats.totalGold >= achievement.condition.value;
                        break;
                    case 'survival_time':
                        unlocked = (gameStats.survivalTime || 0) >= achievement.condition.value;
                        break;
                    case 'speed_mode_completed':
                        unlocked = (gameStats.speedModeCompleted || 0) >= achievement.condition.value;
                        break;
                    case 'challenge_gold':
                        unlocked = (gameStats.challengeGold || 0) >= achievement.condition.value;
                        break;
                    case 'hard_difficulty_success':
                        unlocked = (gameStats.hardDifficultySuccess || 0) >= achievement.condition.value;
                        break;
                    case 'perfect_game':
                        unlocked = gameState.correctWords > 0 && gameState.wrongWords === 0;
                        break;
                }
                
                // 如果解锁了成就
                if (unlocked) {
                    gameState.achievementsUnlocked.push(achievement.id);
                    
                    // 显示成就解锁通知
                    gameState.elements.feedback.textContent = `成就解锁：${achievement.name} - ${achievement.description}`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    
                    // 添加成就到全局成就系统
                    this.addAchievement(achievement.id);
                }
            });
        };
        
        // 开始撤离
        this.startEvacuation = function() {
            // 显示撤离倒计时
            gameState.elements.feedback.textContent = '开始撤离！10秒后撤离完成！';
            gameState.elements.feedback.style.color = '#3498db';
            
            // 停止敌人生成
            this.stopEnemySpawn();
            
            // 开始撤离倒计时
            let evacuationTime = 10;
            const evacuationInterval = setInterval(() => {
                evacuationTime--;
                gameState.elements.feedback.textContent = `撤离中... ${evacuationTime}秒`;
                
                if (evacuationTime <= 0) {
                    // 撤离成功
                    clearInterval(evacuationInterval);
                    this.endSearchAndEvacuateGame(true);
                }
            }, 1000);
        };
        
        // 保存游戏进度
        this.saveGameProgress = function() {
            const saveData = {
                gameMode: gameState.gameMode,
                difficulty: gameState.difficulty,
                gold: gameState.gold,
                tasksCompleted: gameState.tasksCompleted,
                totalTasks: gameState.totalTasks,
                gameTime: gameState.gameTime,
                health: gameState.health,
                correctWords: gameState.correctWords,
                wrongWords: gameState.wrongWords,
                backpack: gameState.backpack,
                goldMultiplier: gameState.goldMultiplier,
                accuracyBoost: gameState.accuracyBoost,
                speedBoost: gameState.speedBoost,
                luckBoost: gameState.luckBoost,
                invincible: gameState.invincible,
                enemies: gameState.enemies,
                timestamp: Date.now()
            };
            
            localStorage.setItem('searchEvacuateGameSave', JSON.stringify(saveData));
            gameState.elements.feedback.textContent = '游戏进度已保存！';
            gameState.elements.feedback.style.color = '#27ae60';
        };
        
        // 加载游戏进度
        this.loadGameProgress = function() {
            const saveData = localStorage.getItem('searchEvacuateGameSave');
            if (saveData) {
                const parsedData = JSON.parse(saveData);
                
                // 恢复游戏状态
                gameState.gameMode = parsedData.gameMode;
                gameState.difficulty = parsedData.difficulty;
                gameState.gold = parsedData.gold;
                gameState.tasksCompleted = parsedData.tasksCompleted;
                gameState.totalTasks = parsedData.totalTasks;
                gameState.gameTime = parsedData.gameTime;
                gameState.health = parsedData.health;
                gameState.correctWords = parsedData.correctWords;
                gameState.wrongWords = parsedData.wrongWords;
                gameState.backpack = parsedData.backpack;
                gameState.goldMultiplier = parsedData.goldMultiplier;
                gameState.accuracyBoost = parsedData.accuracyBoost;
                gameState.speedBoost = parsedData.speedBoost;
                gameState.luckBoost = parsedData.luckBoost;
                gameState.invincible = parsedData.invincible;
                gameState.enemies = parsedData.enemies;
                
                // 更新显示
                gameState.elements.gameGold.textContent = gameState.gold;
                gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                gameState.elements.gameTime.textContent = gameState.gameTime;
                gameState.elements.gameHealth.textContent = gameState.health;
                
                // 渲染敌人
                this.renderEnemies();
                
                // 生成新单词
                this.generateTargetWord();
                
                gameState.elements.feedback.textContent = '游戏进度已加载！';
                gameState.elements.feedback.style.color = '#27ae60';
                
                return true;
            } else {
                gameState.elements.feedback.textContent = '没有找到保存的游戏进度！';
                gameState.elements.feedback.style.color = '#e74c3c';
                return false;
            }
        };
        
        // 自动保存游戏进度
        this.setupAutoSave = function() {
            // 每30秒自动保存一次
            setInterval(() => {
                if (gameState.gameStarted && !gameState.gameOver) {
                    this.saveGameProgress();
                }
            }, 30000);
        };
        
        // 更新排行榜
        this.updateLeaderboard = function(success) {
            if (success) {
                const leaderboardKey = `searchEvacuateLeaderboard_${gameState.gameMode}_${gameState.difficulty}`;
                const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
                
                const score = {
                    gold: gameState.gold,
                    correctWords: gameState.correctWords,
                    tasksCompleted: gameState.tasksCompleted,
                    timeUsed: 60 - gameState.gameTime, // 假设初始时间为60秒
                    timestamp: Date.now()
                };
                
                // 添加新成绩
                leaderboard.push(score);
                
                // 按金币排序，取前10名
                leaderboard.sort((a, b) => b.gold - a.gold);
                if (leaderboard.length > 10) {
                    leaderboard.splice(10);
                }
                
                // 保存排行榜
                localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
                
                // 同时更新总排行榜
                const totalLeaderboardKey = 'searchEvacuateLeaderboard_total';
                const totalLeaderboard = JSON.parse(localStorage.getItem(totalLeaderboardKey) || '[]');
                
                const totalScore = {
                    gold: gameState.gold,
                    correctWords: gameState.correctWords,
                    tasksCompleted: gameState.tasksCompleted,
                    gameMode: gameState.gameMode,
                    difficulty: gameState.difficulty,
                    timestamp: Date.now()
                };
                
                totalLeaderboard.push(totalScore);
                totalLeaderboard.sort((a, b) => b.gold - a.gold);
                if (totalLeaderboard.length > 10) {
                    totalLeaderboard.splice(10);
                }
                
                localStorage.setItem(totalLeaderboardKey, JSON.stringify(totalLeaderboard));
            }
        };
        
        // 显示排行榜
        this.showLeaderboard = function() {
            const leaderboardKey = `searchEvacuateLeaderboard_${gameState.gameMode}_${gameState.difficulty}`;
            const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
            
            let leaderboardHTML = `
                <h4>${this.getGameModeName(gameState.gameMode)} - ${this.getDifficultyName(gameState.difficulty)} 排行榜</h4>
                <div class="leaderboard">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th>金币</th>
                                <th>正确单词</th>
                                <th>完成任务</th>
                                <th>时间</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (leaderboard.length === 0) {
                leaderboardHTML += `
                    <tr>
                        <td colspan="5" class="text-center">暂无记录</td>
                    </tr>
                `;
            } else {
                leaderboard.forEach((score, index) => {
                    leaderboardHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${score.gold}</td>
                            <td>${score.correctWords}</td>
                            <td>${score.tasksCompleted}</td>
                            <td>${score.timeUsed}秒</td>
                        </tr>
                    `;
                });
            }
            
            leaderboardHTML += `
                        </tbody>
                    </table>
                </div>
            `;
            
            // 显示总排行榜
            const totalLeaderboardKey = 'searchEvacuateLeaderboard_total';
            const totalLeaderboard = JSON.parse(localStorage.getItem(totalLeaderboardKey) || '[]');
            
            leaderboardHTML += `
                <h4>总排行榜</h4>
                <div class="leaderboard">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>排名</th>
                                <th>金币</th>
                                <th>正确单词</th>
                                <th>游戏模式</th>
                                <th>难度</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            if (totalLeaderboard.length === 0) {
                leaderboardHTML += `
                    <tr>
                        <td colspan="5" class="text-center">暂无记录</td>
                    </tr>
                `;
            } else {
                totalLeaderboard.forEach((score, index) => {
                    leaderboardHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${score.gold}</td>
                            <td>${score.correctWords}</td>
                            <td>${this.getGameModeName(score.gameMode)}</td>
                            <td>${this.getDifficultyName(score.difficulty)}</td>
                        </tr>
                    `;
                });
            }
            
            leaderboardHTML += `
                        </tbody>
                    </table>
                </div>
                <button class="btn btn-secondary" id="close-leaderboard">关闭排行榜</button>
            `;
            
            // 创建排行榜弹窗
            const leaderboardModal = document.createElement('div');
            leaderboardModal.className = 'leaderboard-modal';
            
            // 创建内容容器
            const contentDiv = document.createElement('div');
            contentDiv.className = 'leaderboard-content';
            contentDiv.innerHTML = leaderboardHTML;
            
            leaderboardModal.appendChild(contentDiv);
            document.body.appendChild(leaderboardModal);
            
            // 确保弹窗可见
            leaderboardModal.style.display = 'flex';
            leaderboardModal.style.opacity = '1';
            
            // 关闭排行榜
            const closeBtn = contentDiv.querySelector('#close-leaderboard');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    document.body.removeChild(leaderboardModal);
                });
            }
            
            // 点击弹窗外部关闭
            leaderboardModal.addEventListener('click', (e) => {
                if (e.target === leaderboardModal) {
                    document.body.removeChild(leaderboardModal);
                }
            });
        };
        
        // 获取游戏模式名称
        this.getGameModeName = function(mode) {
            const modeNames = {
                'standard': '标准模式',
                'survival': '生存模式',
                'challenge': '挑战模式',
                'speed': '速度模式',
                'endless': '无尽模式',
                'theme': '主题模式'
            };
            return modeNames[mode] || mode || '未知模式';
        };
        
        // 获取难度名称
        this.getDifficultyName = function(difficulty) {
            const difficultyNames = {
                'easy': '简单',
                'medium': '中等',
                'hard': '困难',
                'expert': '专家',
                'nightmare': '噩梦'
            };
            return difficultyNames[difficulty] || difficulty || '未知难度';
        };
        
        // 开始敌人生成
        this.startEnemySpawn = function() {
            // 根据难度设置敌人生成间隔
            let spawnInterval = 20000; // 默认20秒
            if (gameState.difficulty === 'medium') {
                spawnInterval = 18000; // 中等难度18秒
            } else if (gameState.difficulty === 'hard') {
                spawnInterval = 15000; // 困难难度15秒
            }
            
            // 开始敌人生成
            gameState.enemySpawnInterval = setInterval(() => {
                this.spawnEnemy();
            }, spawnInterval);
        };
        
        // 停止敌人生成
        this.stopEnemySpawn = function() {
            if (gameState.enemySpawnInterval) {
                clearInterval(gameState.enemySpawnInterval);
                gameState.enemySpawnInterval = null;
            }
        };
        
        // 开始随机事件
        this.startRandomEvents = function() {
            // 每20-30秒触发一次随机事件
            const eventInterval = Math.floor(Math.random() * 10000) + 20000;
            
            gameState.randomEventInterval = setInterval(() => {
                this.triggerRandomEvent();
            }, eventInterval);
        };
        
        // 停止随机事件
        this.stopRandomEvents = function() {
            if (gameState.randomEventInterval) {
                clearInterval(gameState.randomEventInterval);
                gameState.randomEventInterval = null;
            }
        };
        
        // 触发随机事件
        this.triggerRandomEvent = function() {
            // 随机事件列表
            const randomEvents = [
                // 正面事件
                {
                    id: 'lucky_find',
                    name: '幸运发现',
                    description: '发现了一些金币',
                    probability: 0.2,
                    effect: function() {
                        const goldFound = Math.floor(Math.random() * 30) + 10;
                        gameState.gold += goldFound;
                        gameState.elements.gameGold.textContent = gameState.gold;
                        gameState.elements.feedback.textContent = `幸运发现！获得 ${goldFound} 金币！`;
                        gameState.elements.feedback.style.color = '#27ae60';
                    }
                },
                {
                    id: 'health_boost',
                    name: '健康恢复',
                    description: '获得了健康恢复',
                    probability: 0.15,
                    effect: function() {
                        const healthGain = Math.floor(Math.random() * 30) + 20;
                        gameState.health += healthGain;
                        if (gameState.health > 100) gameState.health = 100;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        gameState.elements.feedback.textContent = `健康恢复！生命值 +${healthGain}`;
                        gameState.elements.feedback.style.color = '#27ae60';
                    }
                },
                {
                    id: 'time_boost',
                    name: '时间奖励',
                    description: '获得了额外时间',
                    probability: 0.15,
                    effect: function() {
                        const timeGain = Math.floor(Math.random() * 20) + 10;
                        gameState.gameTime += timeGain;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        gameState.elements.feedback.textContent = `时间奖励！时间 +${timeGain}秒`;
                        gameState.elements.feedback.style.color = '#27ae60';
                    }
                },
                {
                    id: 'free_item',
                    name: '免费道具',
                    description: '获得了一个免费道具',
                    probability: 0.1,
                    effect: function() {
                        const freeItems = [
                            { id: 'free_health', name: '免费生命值恢复', effect: 'health', value: 20 },
                            { id: 'free_time', name: '免费时间增加', effect: 'time', value: 10 },
                            { id: 'free_task', name: '免费任务加速', effect: 'task', value: 1 }
                        ];
                        const randomItem = freeItems[Math.floor(Math.random() * freeItems.length)];
                        gameState.backpack.push(randomItem);
                        gameState.elements.feedback.textContent = `免费道具！获得了 ${randomItem.name}`;
                        gameState.elements.feedback.style.color = '#27ae60';
                    }
                },
                // 负面事件
                {
                    id: 'sudden_enemy',
                    name: '突然袭击',
                    description: '遭遇了突然袭击',
                    probability: 0.15,
                    effect: function() {
                        gameState.elements.feedback.textContent = '突然袭击！敌人出现！';
                        gameState.elements.feedback.style.color = '#e74c3c';
                        // 立即生成一个敌人
                        this.spawnEnemy();
                    }.bind(this)
                },
                {
                    id: 'time_loss',
                    name: '时间流失',
                    description: '时间快速流失',
                    probability: 0.1,
                    effect: function() {
                        const timeLoss = Math.floor(Math.random() * 15) + 5;
                        gameState.gameTime -= timeLoss;
                        if (gameState.gameTime < 0) gameState.gameTime = 0;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        gameState.elements.feedback.textContent = `时间流失！时间 -${timeLoss}秒`;
                        gameState.elements.feedback.style.color = '#e74c3c';
                    }
                },
                {
                    id: 'health_drain',
                    name: '生命汲取',
                    description: '生命被汲取',
                    probability: 0.1,
                    effect: function() {
                        const healthLoss = Math.floor(Math.random() * 20) + 10;
                        gameState.health -= healthLoss;
                        if (gameState.health < 0) gameState.health = 0;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        gameState.elements.feedback.textContent = `生命汲取！生命值 -${healthLoss}`;
                        gameState.elements.feedback.style.color = '#e74c3c';
                        
                        // 检查生命值是否为0
                        if (gameState.health <= 0) {
                            this.endSearchAndEvacuateGame(false);
                        }
                    }.bind(this)
                }
            ];
            
            // 根据概率选择事件
            const weightedEvents = [];
            randomEvents.forEach(event => {
                const weight = Math.floor(event.probability * 100);
                for (let i = 0; i < weight; i++) {
                    weightedEvents.push(event);
                }
            });
            
            // 随机选择一个事件
            const randomEvent = weightedEvents[Math.floor(Math.random() * weightedEvents.length)];
            
            // 触发事件
            randomEvent.effect();
        };
        
        // 生成敌人
        this.spawnEnemy = function() {
            // 获取单词库
            let words = [];
            if (typeof vocabulary !== 'undefined' && vocabulary.words) {
                words = vocabulary.words;
            } else {
                // 使用默认单词数据
                words = [
                    { word: 'apple', meaning: '苹果' },
                    { word: 'banana', meaning: '香蕉' },
                    { word: 'cat', meaning: '猫' },
                    { word: 'dog', meaning: '狗' },
                    { word: 'elephant', meaning: '大象' },
                    { word: 'fish', meaning: '鱼' },
                    { word: 'goat', meaning: '山羊' },
                    { word: 'horse', meaning: '马' },
                    { word: 'ice cream', meaning: '冰淇淋' },
                    { word: 'juice', meaning: '果汁' },
                    { word: 'kite', meaning: '风筝' },
                    { word: 'lion', meaning: '狮子' },
                    { word: 'monkey', meaning: '猴子' },
                    { word: 'notebook', meaning: '笔记本' },
                    { word: 'orange', meaning: '橙子' }
                ];
            }
            
            // 敌人类型
            const enemyTypes = [
                // 基础敌人
                { type: 'distraction', name: '干扰单词', description: '干扰你的注意力', effect: 'distraction', value: 1, health: 1, speed: 1, rarity: 'common' },
                { type: 'time_thief', name: '时间窃贼', description: '偷取你的时间', effect: 'time', value: -5, health: 1, speed: 1, rarity: 'common' },
                { type: 'health_thief', name: '生命值小偷', description: '偷取你的生命值', effect: 'health', value: -15, health: 1, speed: 1, rarity: 'common' },
                { type: 'input_obstructor', name: '输入阻碍者', description: '阻碍你的输入', effect: 'input_block', value: 2, health: 1, speed: 1.1, rarity: 'common' },
                { type: 'score_thief', name: '分数窃贼', description: '偷取你的分数', effect: 'score', value: -10, health: 1, speed: 1, rarity: 'common' },
                // 特殊敌人
                { type: 'word_maze', name: '单词迷宫', description: '使目标单词变得模糊', effect: 'blur', value: 5, health: 2, speed: 0.8, rarity: 'uncommon' },
                { type: 'gold_thief', name: '金币小偷', description: '偷取你的金币', effect: 'gold', value: -20, health: 2, speed: 1.2, rarity: 'uncommon' },
                { type: 'task_obstacle', name: '任务障碍', description: '增加任务难度', effect: 'task', value: -1, health: 2, speed: 0.9, rarity: 'uncommon' },
                { type: 'accuracy_reducer', name: '精准度降低者', description: '降低你的输入精准度', effect: 'accuracy', value: -0.5, health: 2, speed: 1, rarity: 'uncommon' },
                { type: 'word_switcher', name: '单词切换者', description: '随机切换目标单词', effect: 'word_switch', value: 1, health: 2, speed: 0.9, rarity: 'uncommon' },
                // 稀有敌人
                { type: 'time_freeze', name: '时间冻结者', description: '冻结你的时间', effect: 'time_freeze', value: 3, health: 3, speed: 0.7, rarity: 'rare' },
                { type: 'mass_distraction', name: '大规模干扰', description: '同时干扰多个单词', effect: 'mass_distraction', value: 1, health: 3, speed: 0.6, rarity: 'rare' },
                { type: 'life_drain', name: '生命汲取者', description: '持续汲取你的生命值', effect: 'life_drain', value: -5, health: 4, speed: 0.8, rarity: 'rare' },
                { type: 'gold_stealer', name: '金币大盗', description: '大量偷取你的金币', effect: 'gold_steal', value: -50, health: 4, speed: 1.3, rarity: 'rare' },
                { type: 'time_waster', name: '时间浪费者', description: '大量浪费你的时间', effect: 'time_waste', value: -15, health: 4, speed: 0.8, rarity: 'rare' },
                { type: 'task_increaser', name: '任务增加者', description: '大幅增加任务难度', effect: 'task_increase', value: -2, health: 5, speed: 0.7, rarity: 'rare' }
            ];
            
            // 随机选择敌人类型，考虑稀有度
            let weightedEnemyTypes = [];
            enemyTypes.forEach(enemy => {
                let weight = 1;
                switch (enemy.rarity) {
                    case 'common': weight = 5; break;
                    case 'uncommon': weight = 2; break;
                    case 'rare': weight = 1; break;
                }
                for (let i = 0; i < weight; i++) {
                    weightedEnemyTypes.push(enemy);
                }
            });
            
            const randomEnemyType = weightedEnemyTypes[Math.floor(Math.random() * weightedEnemyTypes.length)];
            
            // 随机生成Boss敌人（5%概率）
            if (Math.random() < 0.05) {
                const bossTypes = [
                    { type: 'word_overlord', name: '单词领主', description: '强大的单词统治者', effect: 'word_overload', value: 1, health: 5, speed: 0.4, rarity: 'boss' },
                    { type: 'time_master', name: '时间大师', description: '掌控时间的强大敌人', effect: 'time_manipulation', value: -5, health: 4, speed: 0.5, rarity: 'boss' },
                    { type: 'life_stealer', name: '生命窃取者', description: '贪婪的生命汲取者', effect: 'mass_life_drain', value: -10, health: 6, speed: 0.3, rarity: 'boss' },
                    { type: 'gold_king', name: '金币之王', description: '掌控金币的强大敌人', effect: 'mass_gold_steal', value: -50, health: 8, speed: 0.2, rarity: 'boss' },
                    { type: 'task_master', name: '任务主宰', description: '掌控任务的强大敌人', effect: 'mass_task_increase', value: -3, health: 6, speed: 0.3, rarity: 'boss' },
                    { type: 'chaos_bringer', name: '混沌使者', description: '带来混乱的强大敌人', effect: 'chaos', value: 1, health: 10, speed: 0.2, rarity: 'boss' }
                ];
                
                const bossEnemyType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
                
                // 随机选择一个单词
                const randomWord = words[Math.floor(Math.random() * words.length)];
                
                // 创建Boss敌人对象
                const enemy = {
                    id: Date.now(),
                    type: bossEnemyType.type,
                    name: bossEnemyType.name,
                    description: bossEnemyType.description,
                    effect: bossEnemyType.effect,
                    value: bossEnemyType.value,
                    health: bossEnemyType.health,
                    maxHealth: bossEnemyType.health,
                    speed: bossEnemyType.speed,
                    rarity: bossEnemyType.rarity,
                    isBoss: true,
                    word: randomWord.word,
                    meaning: randomWord.meaning
                };
                
                // 添加到敌人列表
                gameState.enemies.push(enemy);
                
                // 显示Boss出现通知
                gameState.elements.feedback.textContent = 'Boss出现！' + bossEnemyType.name + ' - ' + bossEnemyType.description;
                gameState.elements.feedback.style.color = '#e74c3c';
            } else {
                // 随机选择一个单词
                const randomWord = words[Math.floor(Math.random() * words.length)];
                
                // 创建普通敌人对象
                const enemy = {
                    id: Date.now(),
                    type: randomEnemyType.type,
                    name: randomEnemyType.name,
                    description: randomEnemyType.description,
                    effect: randomEnemyType.effect,
                    value: randomEnemyType.value,
                    health: randomEnemyType.health,
                    maxHealth: randomEnemyType.health,
                    speed: randomEnemyType.speed,
                    rarity: randomEnemyType.rarity,
                    isBoss: false,
                    word: randomWord.word,
                    meaning: randomWord.meaning
                };
                
                // 添加到敌人列表
                gameState.enemies.push(enemy);
            }
            
            // 显示敌人
            this.renderEnemies();
        };
        
        // 渲染敌人
        this.renderEnemies = function() {
            const enemiesContainer = document.getElementById('enemies-container');
            if (enemiesContainer) {
                enemiesContainer.innerHTML = '';
                
                if (gameState.enemies.length === 0) {
                    enemiesContainer.innerHTML = '<p>当前没有敌人</p>';
                    return;
                }
                
                gameState.enemies.forEach(enemy => {
                    const enemyElement = document.createElement('div');
                    enemyElement.className = `enemy ${enemy.isBoss ? 'boss-enemy' : ''} ${enemy.rarity}`;
                    enemyElement.dataset.enemyId = enemy.id;
                    
                    // 根据敌人类型设置不同的样式
                    let enemyColor = '#e74c3c';
                    switch (enemy.rarity) {
                        case 'common':
                            enemyColor = '#95a5a6';
                            break;
                        case 'uncommon':
                            enemyColor = '#27ae60';
                            break;
                        case 'rare':
                            enemyColor = '#3498db';
                            break;
                        case 'boss':
                            enemyColor = '#e74c3c';
                            break;
                    }
                    
                    // 生成敌人效果描述
                    let effectDescription = '';
                    switch (enemy.effect) {
                        case 'distraction':
                            effectDescription = '干扰注意力';
                            break;
                        case 'time':
                            effectDescription = `时间-${Math.abs(enemy.value)}秒`;
                            break;
                        case 'health':
                            effectDescription = `生命值-${Math.abs(enemy.value)}`;
                            break;
                        case 'input_block':
                            effectDescription = '阻碍输入';
                            break;
                        case 'score':
                            effectDescription = `分数-${Math.abs(enemy.value)}`;
                            break;
                        case 'blur':
                            effectDescription = '模糊单词';
                            break;
                        case 'gold':
                            effectDescription = `金币-${Math.abs(enemy.value)}`;
                            break;
                        case 'task':
                            effectDescription = '增加任务难度';
                            break;
                        case 'accuracy':
                            effectDescription = '降低精准度';
                            break;
                        case 'word_switch':
                            effectDescription = '切换目标单词';
                            break;
                        case 'time_freeze':
                            effectDescription = '冻结时间3秒';
                            break;
                        case 'mass_distraction':
                            effectDescription = '大规模干扰';
                            break;
                        case 'life_drain':
                            effectDescription = '持续汲取生命';
                            break;
                        case 'gold_steal':
                            effectDescription = `金币-${Math.abs(enemy.value)}`;
                            break;
                        case 'time_waste':
                            effectDescription = `时间-${Math.abs(enemy.value)}秒`;
                            break;
                        case 'task_increase':
                            effectDescription = '大幅增加任务难度';
                            break;
                        case 'word_overload':
                            effectDescription = '单词 overload';
                            break;
                        case 'time_manipulation':
                            effectDescription = '时间操控';
                            break;
                        case 'mass_life_drain':
                            effectDescription = '大规模生命汲取';
                            break;
                        case 'mass_gold_steal':
                            effectDescription = `金币-${Math.abs(enemy.value)}`;
                            break;
                        case 'mass_task_increase':
                            effectDescription = '大规模增加任务难度';
                            break;
                        case 'chaos':
                            effectDescription = '带来混乱';
                            break;
                    }
                    
                    // 生成生命值条
                    const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
                    
                    enemyElement.innerHTML = `
                        <div class="enemy-name" style="color: ${enemyColor};">
                            ${enemy.isBoss ? '<span class="boss-label">BOSS</span>' : ''}
                            ${enemy.name}
                        </div>
                        <div class="enemy-description">${enemy.description}</div>
                        <div class="enemy-effect">效果: ${effectDescription}</div>
                        <div class="enemy-word" style="margin: 10px 0; padding: 10px; background-color: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                            <strong>单词:</strong> ${enemy.word}
                            <br>
                            <small>意思: ${enemy.meaning}</small>
                        </div>
                        ${enemy.maxHealth > 1 ? `
                            <div class="enemy-health">
                                <div class="health-bar">
                                    <div class="health-fill" style="width: ${healthPercentage}%; background-color: ${enemyColor};"></div>
                                </div>
                                <span class="health-text">${enemy.health}/${enemy.maxHealth}</span>
                            </div>
                        ` : ''}
                        <div class="enemy-input">
                            <input type="text" class="form-control enemy-word-input" placeholder="输入单词击败敌人..." data-enemy-id="${enemy.id}">
                            <button class="btn btn-danger defeat-enemy" data-enemy-id="${enemy.id}">攻击</button>
                        </div>
                    `;
                    
                    enemiesContainer.appendChild(enemyElement);
                });
                
                // 添加击败敌人的事件监听器
                const defeatButtons = document.querySelectorAll('.defeat-enemy');
                defeatButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const enemyId = parseInt(e.target.dataset.enemyId);
                        this.defeatEnemy(enemyId);
                    });
                });
            }
        };
        
        // 击败敌人
        this.defeatEnemy = function(enemyId) {
            const enemyIndex = gameState.enemies.findIndex(enemy => enemy.id === enemyId);
            if (enemyIndex !== -1) {
                const enemy = gameState.enemies[enemyIndex];
                
                // 获取对应敌人的输入框
                const inputElement = document.querySelector(`.enemy-word-input[data-enemy-id="${enemyId}"]`);
                if (inputElement) {
                    const userInput = inputElement.value.trim().toLowerCase();
                    const enemyWord = enemy.word.toLowerCase();
                    
                    if (userInput === enemyWord) {
                        // 输入正确，减少敌人生命值
                        enemy.health--;
                        
                        // 清空输入框
                        inputElement.value = '';
                        
                        // 播放正确音效
                        this.playCorrectSound();
                        
                        if (enemy.health <= 0) {
                            // 移除敌人
                            gameState.enemies.splice(enemyIndex, 1);
                            
                            // 给玩家奖励
                            let goldReward = Math.floor(Math.random() * 10) + 5; // 5-14金币
                    
                            // 根据敌人稀有度增加奖励
                            if (enemy.rarity === 'uncommon') {
                                goldReward *= 1.5;
                            } else if (enemy.rarity === 'rare') {
                                goldReward *= 2;
                            } else if (enemy.isBoss) {
                                goldReward = Math.floor(Math.random() * 50) + 50; // 50-99金币
                                // Boss额外奖励
                                const expReward = Math.floor(Math.random() * 20) + 20;
                                gameState.correctWords += 2;
                                gameState.tasksCompleted += 1;
                            }
                    
                            goldReward = Math.floor(goldReward);
                            gameState.gold += goldReward;
                            gameState.elements.gameGold.textContent = gameState.gold;
                            
                            // 显示击败敌人的消息
                            let defeatMessage = `击败了 ${enemy.name}！获得 ${goldReward} 金币！`;
                            if (enemy.isBoss) {
                                defeatMessage = `击败了 BOSS ${enemy.name}！获得 ${goldReward} 金币和额外奖励！`;
                            }
                            gameState.elements.feedback.textContent = defeatMessage;
                            gameState.elements.feedback.style.color = '#27ae60';
                            
                            // 更新敌人击败统计
                            let gameStats = JSON.parse(localStorage.getItem('searchEvacuateGameStats') || '{}');
                            gameStats.totalEnemiesDefeated = (gameStats.totalEnemiesDefeated || 0) + 1;
                            if (enemy.isBoss) {
                                gameStats.totalBossesDefeated = (gameStats.totalBossesDefeated || 0) + 1;
                            }
                            localStorage.setItem('searchEvacuateGameStats', JSON.stringify(gameStats));
                        }
                
                        // 重新渲染敌人
                        this.renderEnemies();
                    }
                }
            }
        };
        
        // 敌人行动
        this.enemyAction = function() {
            // 检查敌人是否到达玩家
            gameState.enemies.forEach(enemy => {
                // 敌人向玩家移动
                enemy.speed -= 0.1;
                
                // 如果敌人到达玩家
                if (enemy.speed <= 0) {
                    // 应用敌人效果
                    this.applyEnemyEffect(enemy);
                    
                    // 移除敌人
                    const enemyIndex = gameState.enemies.findIndex(e => e.id === enemy.id);
                    if (enemyIndex !== -1) {
                        gameState.enemies.splice(enemyIndex, 1);
                    }
                    
                    // 重新渲染敌人
                    this.renderEnemies();
                }
            });
        };
        
        // 应用敌人效果
        this.applyEnemyEffect = function(enemy) {
            switch (enemy.effect) {
                case 'distraction':
                    // 干扰效果：短暂模糊目标单词
                    gameState.elements.targetWord.style.filter = 'blur(3px)';
                    setTimeout(() => {
                        gameState.elements.targetWord.style.filter = 'none';
                    }, 3000);
                    gameState.elements.feedback.textContent = `${enemy.name} 干扰了你的注意力！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'time':
                    // 时间窃贼：减少游戏时间
                    gameState.gameTime += enemy.value;
                    if (gameState.gameTime < 0) gameState.gameTime = 0;
                    gameState.elements.gameTime.textContent = gameState.gameTime;
                    gameState.elements.feedback.textContent = `${enemy.name} 偷取了你的时间！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'health':
                    // 生命值小偷：减少生命值
                    gameState.health += enemy.value;
                    if (gameState.health < 0) gameState.health = 0;
                    gameState.elements.gameHealth.textContent = gameState.health;
                    gameState.elements.feedback.textContent = `${enemy.name} 偷取了你的生命值！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    
                    // 检查生命值是否为0
                    if (gameState.health <= 0) {
                        this.endSearchAndEvacuateGame(false);
                    }
                    break;
                case 'input_block':
                    // 输入阻碍者：阻碍输入
                    gameState.elements.typingInput.disabled = true;
                    setTimeout(() => {
                        gameState.elements.typingInput.disabled = false;
                        gameState.elements.typingInput.focus();
                    }, 2000);
                    gameState.elements.feedback.textContent = `${enemy.name} 阻碍了你的输入！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'score':
                    // 分数窃贼：偷取分数
                    gameState.correctWords = Math.max(0, gameState.correctWords + enemy.value);
                    gameState.elements.feedback.textContent = `${enemy.name} 偷取了你的分数！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'blur':
                    // 单词迷宫：模糊单词更长时间
                    gameState.elements.targetWord.style.filter = 'blur(5px)';
                    setTimeout(() => {
                        gameState.elements.targetWord.style.filter = 'none';
                    }, 5000);
                    gameState.elements.feedback.textContent = `${enemy.name} 使单词变得模糊！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'gold':
                    // 金币小偷：偷取金币
                    gameState.gold += enemy.value;
                    if (gameState.gold < 0) gameState.gold = 0;
                    gameState.elements.gameGold.textContent = gameState.gold;
                    gameState.elements.feedback.textContent = `${enemy.name} 偷取了你的金币！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'task':
                    // 任务障碍：增加任务难度
                    gameState.totalTasks += 1;
                    gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                    gameState.elements.feedback.textContent = `${enemy.name} 增加了任务难度！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'accuracy':
                    // 精准度降低者：降低精准度
                    gameState.accuracyPenalty = true;
                    setTimeout(() => {
                        gameState.accuracyPenalty = false;
                    }, 5000);
                    gameState.elements.feedback.textContent = `${enemy.name} 降低了你的精准度！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'word_switch':
                    // 单词切换者：切换目标单词
                    this.generateTargetWord();
                    gameState.elements.feedback.textContent = `${enemy.name} 切换了目标单词！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'time_freeze':
                    // 时间冻结者：冻结时间
                    gameState.elements.gameTime.textContent = '冻结中...';
                    const originalGameTime = gameState.gameTime;
                    
                    // 暂停计时器
                    clearInterval(gameState.timerInterval);
                    
                    setTimeout(() => {
                        gameState.gameTime = originalGameTime;
                        gameState.elements.gameTime.textContent = gameState.gameTime;
                        
                        // 重新开始计时器
                        gameState.timerInterval = setInterval(() => {
                            gameState.gameTime--;
                            gameState.elements.gameTime.textContent = gameState.gameTime;
                            
                            if (gameState.gameTime <= 0) {
                                this.endSearchAndEvacuateGame(false);
                            }
                        }, 1000);
                    }, 3000);
                    
                    gameState.elements.feedback.textContent = `${enemy.name} 冻结了时间！`;
                    gameState.elements.feedback.style.color = '#3498db';
                    break;
                case 'mass_distraction':
                    // 大规模干扰：干扰多个元素
                    gameState.elements.targetWord.style.filter = 'blur(3px)';
                    gameState.elements.currentMeaning.style.filter = 'blur(3px)';
                    gameState.elements.currentExample.style.filter = 'blur(3px)';
                    setTimeout(() => {
                        gameState.elements.targetWord.style.filter = 'none';
                        gameState.elements.currentMeaning.style.filter = 'none';
                        gameState.elements.currentExample.style.filter = 'none';
                    }, 4000);
                    gameState.elements.feedback.textContent = `${enemy.name} 造成了大规模干扰！`;
                    gameState.elements.feedback.style.color = '#f39c12';
                    break;
                case 'life_drain':
                    // 生命汲取者：持续汲取生命
                    gameState.health += enemy.value;
                    if (gameState.health < 0) gameState.health = 0;
                    gameState.elements.gameHealth.textContent = gameState.health;
                    
                    // 持续伤害
                    const drainInterval = setInterval(() => {
                        gameState.health -= 2;
                        if (gameState.health < 0) gameState.health = 0;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        
                        if (gameState.health <= 0) {
                            clearInterval(drainInterval);
                            this.endSearchAndEvacuateGame(false);
                        }
                    }, 1000);
                    
                    setTimeout(() => {
                        clearInterval(drainInterval);
                    }, 5000);
                    
                    gameState.elements.feedback.textContent = `${enemy.name} 正在汲取你的生命！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    
                    // 检查生命值是否为0
                    if (gameState.health <= 0) {
                        this.endSearchAndEvacuateGame(false);
                    }
                    break;
                case 'gold_steal':
                    // 金币大盗：大量偷取金币
                    gameState.gold += enemy.value;
                    if (gameState.gold < 0) gameState.gold = 0;
                    gameState.elements.gameGold.textContent = gameState.gold;
                    gameState.elements.feedback.textContent = `${enemy.name} 大量偷取了你的金币！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'time_waste':
                    // 时间浪费者：大量浪费时间
                    gameState.gameTime += enemy.value;
                    if (gameState.gameTime < 0) gameState.gameTime = 0;
                    gameState.elements.gameTime.textContent = gameState.gameTime;
                    gameState.elements.feedback.textContent = `${enemy.name} 大量浪费了你的时间！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'task_increase':
                    // 任务增加者：大幅增加任务难度
                    gameState.totalTasks += Math.abs(enemy.value);
                    gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                    gameState.elements.feedback.textContent = `${enemy.name} 大幅增加了任务难度！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'word_overload':
                    // 单词领主：单词 overload
                    gameState.elements.targetWord.style.fontSize = '24px';
                    gameState.elements.targetWord.style.color = '#e74c3c';
                    setTimeout(() => {
                        gameState.elements.targetWord.style.fontSize = '';
                        gameState.elements.targetWord.style.color = '';
                    }, 3000);
                    gameState.elements.feedback.textContent = `${enemy.name} 造成了单词 overload！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'time_manipulation':
                    // 时间大师：时间操控
                    gameState.gameTime += enemy.value;
                    if (gameState.gameTime < 0) gameState.gameTime = 0;
                    gameState.elements.gameTime.textContent = gameState.gameTime;
                    gameState.elements.feedback.textContent = `${enemy.name} 操控了时间！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'mass_life_drain':
                    // 生命窃取者：大规模生命汲取
                    gameState.health += enemy.value;
                    if (gameState.health < 0) gameState.health = 0;
                    gameState.elements.gameHealth.textContent = gameState.health;
                    
                    // 持续大规模伤害
                    const massDrainInterval = setInterval(() => {
                        gameState.health -= 5;
                        if (gameState.health < 0) gameState.health = 0;
                        gameState.elements.gameHealth.textContent = gameState.health;
                        
                        if (gameState.health <= 0) {
                            clearInterval(massDrainInterval);
                            this.endSearchAndEvacuateGame(false);
                        }
                    }, 1000);
                    
                    setTimeout(() => {
                        clearInterval(massDrainInterval);
                    }, 8000);
                    
                    gameState.elements.feedback.textContent = `${enemy.name} 正在大规模汲取你的生命！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    
                    // 检查生命值是否为0
                    if (gameState.health <= 0) {
                        this.endSearchAndEvacuateGame(false);
                    }
                    break;
                case 'mass_gold_steal':
                    // 金币之王：大规模偷取金币
                    gameState.gold += enemy.value;
                    if (gameState.gold < 0) gameState.gold = 0;
                    gameState.elements.gameGold.textContent = gameState.gold;
                    gameState.elements.feedback.textContent = `${enemy.name} 大规模偷取了你的金币！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'mass_task_increase':
                    // 任务主宰：大规模增加任务难度
                    gameState.totalTasks += Math.abs(enemy.value);
                    gameState.elements.gameTask.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
                    gameState.elements.feedback.textContent = `${enemy.name} 大规模增加了任务难度！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
                case 'chaos':
                    // 混沌使者：带来混乱
                    gameState.elements.targetWord.style.filter = 'blur(5px)';
                    gameState.elements.currentMeaning.style.filter = 'blur(5px)';
                    gameState.elements.currentExample.style.filter = 'blur(5px)';
                    gameState.elements.typingInput.disabled = true;
                    
                    setTimeout(() => {
                        gameState.elements.targetWord.style.filter = 'none';
                        gameState.elements.currentMeaning.style.filter = 'none';
                        gameState.elements.currentExample.style.filter = 'none';
                        gameState.elements.typingInput.disabled = false;
                        gameState.elements.typingInput.focus();
                        this.generateTargetWord(); // 生成新单词
                    }, 5000);
                    
                    gameState.elements.feedback.textContent = `${enemy.name} 带来了混乱！`;
                    gameState.elements.feedback.style.color = '#e74c3c';
                    break;
            }
        };
        
        // 结束游戏
        this.endSearchAndEvacuateGame = function(success) {
            // 清除计时器
            clearInterval(gameState.timerInterval);
            
            // 停止敌人生成
            this.stopEnemySpawn();
            
            // 停止随机事件
            this.stopRandomEvents();
            
            // 更新游戏状态
            gameState.gameOver = true;
            gameState.elements.gameMain.style.display = 'none';
            gameState.elements.gameOver.style.display = 'block';
            
            // 根据游戏模式和结果更新游戏结果
            let resultText, resultColor;
            if (success) {
                switch (gameState.gameMode) {
                    case 'standard':
                        resultText = '撤离成功！';
                        break;
                    case 'survival':
                        resultText = '生存挑战成功！';
                        break;
                    case 'challenge':
                        resultText = '挑战完成！';
                        break;
                    case 'speed':
                        resultText = '速度挑战成功！';
                        break;
                }
                resultColor = '#27ae60';
            } else {
                switch (gameState.gameMode) {
                    case 'standard':
                        resultText = '撤离失败！';
                        break;
                    case 'survival':
                        resultText = '生存挑战失败！';
                        break;
                    case 'challenge':
                        resultText = '挑战失败！';
                        break;
                    case 'speed':
                        resultText = '速度挑战失败！';
                        break;
                }
                resultColor = '#e74c3c';
            }
            
            gameState.elements.gameResult.textContent = resultText;
            gameState.elements.gameResult.style.color = resultColor;
            
            // 更新最终统计
            gameState.elements.finalGold.textContent = gameState.gold;
            gameState.elements.finalTasks.textContent = `${gameState.tasksCompleted}/${gameState.totalTasks}`;
            gameState.elements.finalCorrect.textContent = gameState.correctWords;
            gameState.elements.finalWrong.textContent = gameState.wrongWords;
            
            // 根据游戏模式计算经验值和积分
            let expMultiplier = 1;
            let pointMultiplier = 1;
            
            switch (gameState.gameMode) {
                case 'standard':
                    expMultiplier = 1;
                    pointMultiplier = 1;
                    break;
                case 'survival':
                    expMultiplier = 1.5;
                    pointMultiplier = 1.2;
                    break;
                case 'challenge':
                    expMultiplier = 2;
                    pointMultiplier = 1.5;
                    break;
                case 'speed':
                    expMultiplier = 1.3;
                    pointMultiplier = 1.1;
                    break;
            }
            
            // 添加经验值和积分
            const exp = Math.floor(gameState.correctWords * 3 * expMultiplier);
            const points = Math.floor(gameState.gold * pointMultiplier);
            this.addExperience(exp);
            this.addPoints(points);
            
            // 更新本地存储中的游戏统计数据
            let gameStats = JSON.parse(localStorage.getItem('searchEvacuateGameStats') || '{}');
            
            if (success) {
                gameStats.successfulEvacuations = (gameStats.successfulEvacuations || 0) + 1;
                
                // 检查是否是困难难度成功
                if (gameState.difficulty === 'hard') {
                    gameStats.hardDifficultySuccess = (gameStats.hardDifficultySuccess || 0) + 1;
                }
                
                // 更新排行榜
                this.updateLeaderboard(success);
            }
            
            // 保存游戏统计数据
            localStorage.setItem('searchEvacuateGameStats', JSON.stringify(gameStats));
            
            // 检查成就
            this.checkAchievements();
            
            // 显示本次游戏获得的成就
            const unlockedAchievementsElement = document.getElementById('unlocked-achievements');
            if (unlockedAchievementsElement) {
                unlockedAchievementsElement.innerHTML = '';
                
                if (gameState.achievementsUnlocked.length > 0) {
                    gameState.achievementsUnlocked.forEach(achievementId => {
                        const achievement = gameState.achievements.find(a => a.id === achievementId);
                        if (achievement) {
                            const achievementElement = document.createElement('div');
                            achievementElement.className = 'achievement-item';
                            achievementElement.innerHTML = `
                                <span class="achievement-name">${achievement.name}</span>
                                <span class="achievement-description">${achievement.description}</span>
                            `;
                            unlockedAchievementsElement.appendChild(achievementElement);
                        }
                    });
                } else {
                    unlockedAchievementsElement.innerHTML = '<p>本次游戏未获得新成就</p>';
                }
            }
            
            // 添加学习历史记录
            const gameModeText = {
                'standard': '标准模式',
                'survival': '生存模式',
                'challenge': '挑战模式',
                'speed': '速度模式'
            }[gameState.gameMode];
            
            const resultStatus = success ? '成功' : '失败';
            this.addHistoryRecord('趣味学习', `完成了搜打撤英语游戏(${gameModeText})，结果: ${resultStatus}，得分: ${points}`);
        };
        
        // 重新开始游戏
        restartGameBtn.addEventListener('click', () => {
            gameState.elements.gameOver.style.display = 'none';
            gameState.elements.gameModeSelection.style.display = 'block';
            gameState.elements.gameStart.style.display = 'none';
        });
        
        // 退出游戏
        exitGameBtn.addEventListener('click', () => {
            this.closeCurrentActivity();
        });
    }

    // 暂停音频
    pauseAudio() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.isPlaying = false;
            const audioPlay = document.getElementById('audio-play');
            if (audioPlay) {
                audioPlay.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    }

    // 更新音频列表
    updateAudioList() {
        const audioList = document.getElementById('audio-list');
        if (audioList) {
            audioList.innerHTML = '';
            
            this.audioFiles.forEach((file, index) => {
                const li = document.createElement('li');
                li.textContent = file;
                li.dataset.index = index;
                if (index === this.currentAudioIndex) {
                    li.classList.add('active');
                }
                li.addEventListener('click', () => {
                    this.currentAudioIndex = index;
                    this.loadAudio();
                    this.playAudio();
                });
                audioList.appendChild(li);
            });
        }
    }

    // 更新音频列表选择
    updateAudioListSelection() {
        const audioListItems = document.querySelectorAll('#audio-list li');
        audioListItems.forEach((item, index) => {
            if (index === this.currentAudioIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // 打乱数组
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// 初始化趣味学习
const funLearn = new FunLearn();

// 导出funLearn实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = funLearn;
} else {
    window.funLearn = funLearn;
}