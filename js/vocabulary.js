class Vocabulary {
    constructor() {
        this.words = this.loadWords();
        this.currentWordIndex = this.loadCurrentWordIndex();
        this.learnedWords = new Set();
        this.unknownWords = new Set(); // 生词本
        this.wordMemoryStrength = new Map(); // 单词记忆强度
        this.learningGoal = 10; // 每日学习目标
        this.points = this.loadPoints(); // 积分系统
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupWordActions();
        this.loadLearnedWords();
        this.loadUnknownWords();
        this.loadWordMemoryStrength();
        this.checkSpeechSynthesis();
        this.showCurrentWord();
        this.addAudioPlayer();
        this.updateStats();
        this.setupLearningGoal();
        this.setupSearch();
        this.setupReviewSystem();
        this.setupFirstLetterFilter();
        this.setupWordExplorer();
        this.setupEasterEgg();
        this.setupExportImport();
        this.setupSentenceClub();
    }
    
    // 按首字母筛选单词
    filterWordsByFirstLetter(letter) {
        if (!letter) return this.words;
        return this.words.filter(word => word.word.toLowerCase().startsWith(letter.toLowerCase()));
    }
    
    // 初始化首字母筛选功能
    setupFirstLetterFilter() {
        // 移除重复的字母按钮生成，避免与 vocabulary-filter.js 冲突
        // 字母筛选功能由 vocabulary-filter.js 专门处理
    }
    
    // 设置复习系统
    setupReviewSystem() {
        // 加载复习时间数据
        const reviewTimes = JSON.parse(localStorage.getItem('wordReviewTimes') || '{}');
        
        // 初始化复习标签
        const reviewTab = document.querySelector('.tab-btn[data-tab="review-section"]');
        if (reviewTab) {
            reviewTab.addEventListener('click', () => {
                this.showReviewWords();
            });
        }
        
        // 检查是否有需要复习的单词，并在页面加载时显示提醒
        this.checkReviewReminder();
    }
    
    // 检查复习提醒
    checkReviewReminder() {
        const wordsForReview = this.getWordsForReview();
        if (wordsForReview.length > 0) {
            // 显示复习提醒
            const reminderElement = document.getElementById('review-reminder');
            if (reminderElement) {
                reminderElement.innerHTML = `
                    <div class="review-reminder">
                        <i class="fas fa-bell"></i>
                        <span>有 ${wordsForReview.length} 个单词需要复习</span>
                        <button class="btn btn-sm btn-primary" id="go-to-review">去复习</button>
                    </div>
                `;
                
                // 绑定去复习按钮事件
                const goToReviewBtn = document.getElementById('go-to-review');
                if (goToReviewBtn) {
                    goToReviewBtn.addEventListener('click', () => {
                        // 切换到复习标签
                        const reviewTab = document.querySelector('.tab-btn[data-tab="review-section"]');
                        if (reviewTab) {
                            reviewTab.click();
                        }
                    });
                }
            }
        }
    }
    
    // 加载当前单词索引
    loadCurrentWordIndex() {
        const savedIndex = localStorage.getItem('currentWordIndex');
        return savedIndex ? parseInt(savedIndex) : 0;
    }
    
    // 保存当前单词索引
    saveCurrentWordIndex() {
        localStorage.setItem('currentWordIndex', this.currentWordIndex);
    }
    
    // 加载积分
    loadPoints() {
        const savedPoints = localStorage.getItem('vocabularyPoints');
        return savedPoints ? parseInt(savedPoints) : 0;
    }
    
    // 保存积分
    savePoints() {
        localStorage.setItem('vocabularyPoints', this.points);
    }
    
    // 奖励积分
    awardPoints(points) {
        this.points += points;
        this.savePoints();
        this.updateStats();
    }
    
    // 加载生词本
    loadUnknownWords() {
        const unknown = localStorage.getItem('unknownWords');
        if (unknown) {
            this.unknownWords = new Set(JSON.parse(unknown));
        }
    }

    // 保存生词本
    saveUnknownWords() {
        localStorage.setItem('unknownWords', JSON.stringify([...this.unknownWords]));
    }

    // 设置学习目标
    setupLearningGoal() {
        const goalInput = document.getElementById('learning-goal');
        const goalDisplay = document.getElementById('goal-display');
        const reviewInterval = document.getElementById('review-interval');
        const difficultyLevel = document.getElementById('difficulty-level');
        const savePlanBtn = document.getElementById('save-plan');
        const planDetails = document.getElementById('plan-details');
        
        if (goalInput) {
            // 加载保存的学习目标
            const savedGoal = localStorage.getItem('learningGoal');
            if (savedGoal) {
                this.learningGoal = parseInt(savedGoal);
                goalInput.value = this.learningGoal;
            }
            
            goalInput.addEventListener('change', (e) => {
                this.learningGoal = parseInt(e.target.value);
                localStorage.setItem('learningGoal', this.learningGoal);
                this.updateStats();
                this.generatePlanPreview();
            });
        }
        
        if (goalDisplay) {
            goalDisplay.textContent = this.learningGoal;
        }
        
        // 加载复习间隔设置
        if (reviewInterval) {
            const savedInterval = localStorage.getItem('reviewInterval');
            if (savedInterval) {
                reviewInterval.value = savedInterval;
            }
            
            reviewInterval.addEventListener('change', () => {
                localStorage.setItem('reviewInterval', reviewInterval.value);
                this.generatePlanPreview();
            });
        }
        
        // 加载难度级别设置
        if (difficultyLevel) {
            const savedDifficulty = localStorage.getItem('difficultyLevel');
            if (savedDifficulty) {
                difficultyLevel.value = savedDifficulty;
            }
            
            difficultyLevel.addEventListener('change', () => {
                localStorage.setItem('difficultyLevel', difficultyLevel.value);
                this.generatePlanPreview();
            });
        }
        
        // 保存学习计划按钮
        if (savePlanBtn) {
            savePlanBtn.addEventListener('click', () => {
                this.saveLearningPlan();
            });
        }
        
        // 生成学习计划预览
        this.generatePlanPreview();
    }

    // 保存学习计划
    saveLearningPlan() {
        const goalInput = document.getElementById('learning-goal');
        const reviewInterval = document.getElementById('review-interval');
        const difficultyLevel = document.getElementById('difficulty-level');
        
        if (goalInput && reviewInterval && difficultyLevel) {
            // 保存设置
            this.learningGoal = parseInt(goalInput.value);
            localStorage.setItem('learningGoal', this.learningGoal);
            localStorage.setItem('reviewInterval', reviewInterval.value);
            localStorage.setItem('difficultyLevel', difficultyLevel.value);
            
            // 显示保存成功提示
            alert('学习计划保存成功！');
            
            // 更新统计信息
            this.updateStats();
        }
    }

    // 生成学习计划预览
    generatePlanPreview() {
        const planDetails = document.getElementById('plan-details');
        if (!planDetails) return;
        
        const goalInput = document.getElementById('learning-goal');
        const reviewInterval = document.getElementById('review-interval');
        const difficultyLevel = document.getElementById('difficulty-level');
        
        if (goalInput && reviewInterval && difficultyLevel) {
            const goal = parseInt(goalInput.value);
            const interval = reviewInterval.value;
            const difficulty = difficultyLevel.value;
            
            // 根据难度级别调整每日学习时间估计
            let estimatedTime;
            switch (difficulty) {
                case 'easy':
                    estimatedTime = goal * 2; // 每个单词2分钟
                    break;
                case 'medium':
                    estimatedTime = goal * 3; // 每个单词3分钟
                    break;
                case 'hard':
                    estimatedTime = goal * 4; // 每个单词4分钟
                    break;
            }
            
            // 生成计划预览
            planDetails.innerHTML = `
                <div class="plan-item">
                    <strong>每日学习目标：</strong> ${goal} 个单词
                </div>
                <div class="plan-item">
                    <strong>复习间隔：</strong> ${interval} 天
                </div>
                <div class="plan-item">
                    <strong>难度级别：</strong> ${difficulty === 'easy' ? '简单' : difficulty === 'medium' ? '中等' : '困难'}
                </div>
                <div class="plan-item">
                    <strong>估计每日学习时间：</strong> ${estimatedTime} 分钟
                </div>
                <div class="plan-item">
                    <strong>学习策略：</strong> ${difficulty === 'easy' ? '基础单词优先' : difficulty === 'medium' ? '综合词汇学习' : '高级词汇挑战'}
                </div>
                <div class="plan-item">
                    <strong>复习提醒：</strong> 系统将根据记忆强度自动安排复习
                </div>
            `;
        }
    }

    // 添加音频播放器功能
    addAudioPlayer() {
        // 音频播放器已在HTML中定义，这里添加单词发音功能
        this.bindAudioPlayButtons();
    }

    // 绑定音频播放按钮事件
    bindAudioPlayButtons() {
        // 使用事件委托，将事件监听器添加到父元素上
        const vocabularySection = document.getElementById('vocabulary');
        if (vocabularySection) {
            // 先移除现有的事件监听器（如果存在）
            if (this.handleAudioPlayClick) {
                vocabularySection.removeEventListener('click', this.handleAudioPlayClick);
            }
            
            // 保存事件处理函数的引用
            this.handleAudioPlayClick = (e) => {
                // 处理所有音频播放按钮，包括句乐部的
                const playButton = e.target.closest('.play-audio, .play-audio-btn');
                if (playButton) {
                    const word = playButton.getAttribute('data-word');
                    if (word) {
                        this.playWordAudio(word);
                    }
                }
            };
            
            // 添加新的事件监听器
            vocabularySection.addEventListener('click', this.handleAudioPlayClick);
        }
    }

    // 播放单词音频
    playWordAudio(word) {
        if ('speechSynthesis' in window) {
            try {
                // 先暂停之前的音频
                speechSynthesis.cancel();
                
                // 获取可用的语音
                let voices = speechSynthesis.getVoices();
                
                // 如果没有可用语音，等待语音加载
                if (voices.length === 0) {
                    // 等待语音加载完成
                    return new Promise((resolve) => {
                        speechSynthesis.onvoiceschanged = () => {
                            voices = speechSynthesis.getVoices();
                            this.speakWord(word, voices);
                            resolve();
                        };
                    });
                } else {
                    this.speakWord(word, voices);
                }
            } catch (error) {
                console.error('音频播放异常:', error);
                alert('音频播放失败，请检查浏览器设置');
            }
        } else {
            alert('您的浏览器不支持语音合成功能');
        }
    }
    
    // 实际执行语音合成
    speakWord(word, voices) {
        try {
            // 选择英文语音
            const englishVoice = voices.find(voice => 
                voice.lang === 'en-US' || voice.lang === 'en-GB'
            ) || voices[0];
            
            // 创建新的语音实例
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = 'en-US';
            utterance.voice = englishVoice;
            utterance.rate = 0.9; // 稍微放慢语速，使发音更清晰
            utterance.pitch = 1; // 保持正常音调
            utterance.volume = 1; // 最大音量
            
            // 播放音频
            speechSynthesis.speak(utterance);
            
            // 监听播放结束事件
            utterance.onend = function() {
                console.log('音频播放完成:', word);
            };
            
            // 监听错误事件
            utterance.onerror = function(event) {
                console.error('音频播放错误:', event);
                alert('音频播放失败，请重试');
            };
        } catch (error) {
            console.error('语音合成失败:', error);
            alert('音频播放失败，请重试');
        }
    }
    
    // 检查语音合成是否可用
    checkSpeechSynthesis() {
        if (!('speechSynthesis' in window)) {
            console.warn('浏览器不支持语音合成功能');
            return false;
        }
        
        // 检查是否有可用的语音
        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
            // 尝试获取语音
            speechSynthesis.onvoiceschanged = function() {
                const updatedVoices = speechSynthesis.getVoices();
                if (updatedVoices.length > 0) {
                    console.log('语音合成已就绪，可用语音数:', updatedVoices.length);
                } else {
                    console.warn('没有可用的语音');
                }
            };
        } else {
            console.log('语音合成已就绪，可用语音数:', voices.length);
        }
        
        return true;
    }
    
    // 为单词添加词性信息
    enhanceWordsWithPartOfSpeech(words) {
        // 简单的词性映射表
        const partOfSpeechMap = {
            'apple': 'noun',
            'apply': 'verb',
            'apartment': 'noun',
            'ability': 'noun',
            'able': 'adjective',
            'about': 'preposition',
            'above': 'preposition',
            'abroad': 'adverb',
            'absence': 'noun',
            'absolute': 'adjective',
            'absorb': 'verb',
            'abstract': 'adjective',
            'abundant': 'adjective',
            'abuse': 'verb',
            'academic': 'adjective',
            'accept': 'verb',
            'access': 'noun',
            'accident': 'noun',
            'accompany': 'verb',
            'according': 'preposition',
            'account': 'noun',
            'accurate': 'adjective',
            'accuse': 'verb',
            'ache': 'noun',
            'achieve': 'verb',
            'achievement': 'noun',
            'acid': 'adjective',
            'acquaintance': 'noun',
            'acquire': 'verb',
            'across': 'preposition',
            'act': 'verb',
            'action': 'noun',
            'active': 'adjective',
            'activity': 'noun',
            'actor': 'noun',
            'actress': 'noun',
            'actual': 'adjective',
            'actually': 'adverb',
            'acute': 'adjective',
            'adapt': 'verb',
            'adaptation': 'noun',
            'add': 'verb',
            'addition': 'noun',
            'additional': 'adjective',
            'address': 'noun',
            'adequate': 'adjective',
            'adjust': 'verb',
            'adjustment': 'noun',
            'administration': 'noun',
            'admire': 'verb',
            'admit': 'verb',
            'adopt': 'verb',
            'adult': 'noun',
            'advance': 'verb',
            'advanced': 'adjective',
            'advantage': 'noun',
            'adventure': 'noun',
            'advertise': 'verb',
            'advertisement': 'noun',
            'advice': 'noun',
            'advise': 'verb',
            'aeroplane': 'noun',
            'affair': 'noun',
            'affect': 'verb',
            'affection': 'noun',
            'afford': 'verb',
            'afraid': 'adjective',
            'Africa': 'noun',
            'African': 'adjective',
            'after': 'preposition',
            'afternoon': 'noun',
            'afterwards': 'adverb',
            'again': 'adverb',
            'against': 'preposition',
            'age': 'noun',
            'aged': 'adjective',
            'agency': 'noun',
            'agent': 'noun',
            'aggressive': 'adjective',
            'ago': 'adverb',
            'agree': 'verb',
            'agreement': 'noun',
            'agriculture': 'noun',
            'ahead': 'adverb',
            'aid': 'noun',
            'aim': 'verb',
            'air': 'noun',
            'aircraft': 'noun',
            'airline': 'noun',
            'airport': 'noun',
            'airspace': 'noun',
            'alarm': 'noun',
            'album': 'noun',
            'alcohol': 'noun',
            'alcoholic': 'adjective',
            'algebra': 'noun',
            'alike': 'adjective',
            'alive': 'adjective',
            'all': 'adjective',
            'alliance': 'noun',
            'allow': 'verb',
            'allowance': 'noun',
            'ally': 'noun',
            'almost': 'adverb',
            'alone': 'adjective',
            'along': 'preposition',
            'aloud': 'adverb',
            'alphabet': 'noun',
            'already': 'adverb',
            'also': 'adverb',
            'alternative': 'adjective',
            'although': 'conjunction',
            'altitude': 'noun',
            'altogether': 'adverb',
            'always': 'adverb',
            'am': 'verb',
            'amateur': 'adjective',
            'amaze': 'verb',
            'amazing': 'adjective',
            'ambassador': 'noun',
            'ambition': 'noun',
            'ambitious': 'adjective',
            'ambulance': 'noun',
            'America': 'noun',
            'American': 'adjective',
            'among': 'preposition',
            'amount': 'noun',
            'ample': 'adjective',
            'amplify': 'verb',
            'amuse': 'verb',
            'amusement': 'noun',
            'analyze': 'verb',
            'analysis': 'noun',
            'ancestor': 'noun',
            'anchor': 'noun',
            'ancient': 'adjective',
            'and': 'conjunction',
            'anger': 'noun',
            'angry': 'adjective',
            'animal': 'noun',
            'ankle': 'noun',
            'anniversary': 'noun',
            'announce': 'verb',
            'announcement': 'noun',
            'annoy': 'verb',
            'annual': 'adjective',
            'another': 'adjective',
            'answer': 'verb',
            'ant': 'noun',
            'anticipate': 'verb',
            'antique': 'adjective',
            'anxiety': 'noun',
            'anxious': 'adjective',
            'any': 'adjective',
            'anybody': 'pronoun',
            'anyhow': 'adverb',
            'anyone': 'pronoun',
            'anything': 'pronoun',
            'anyway': 'adverb',
            'anywhere': 'adverb',
            'apart': 'adverb',
            'apartment': 'noun',
            'apologize': 'verb',
            'apology': 'noun',
            'appear': 'verb',
            'appearance': 'noun',
            'appendix': 'noun',
            'applaud': 'verb',
            'apple': 'noun',
            'application': 'noun',
            'apply': 'verb',
            'appoint': 'verb',
            'appointment': 'noun',
            'appreciate': 'verb',
            'approach': 'verb',
            'appropriate': 'adjective',
            'approval': 'noun',
            'approve': 'verb',
            'approximately': 'adverb',
            'apron': 'noun',
            'apt': 'adjective',
            'aptitude': 'noun',
            'aquatic': 'adjective',
            'arbitrary': 'adjective',
            'arch': 'noun',
            'architect': 'noun',
            'architecture': 'noun',
            'area': 'noun',
            'argue': 'verb',
            'argument': 'noun',
            'arise': 'verb',
            'arm': 'noun',
            'armchair': 'noun',
            'army': 'noun',
            'around': 'preposition',
            'arrange': 'verb',
            'arrangement': 'noun',
            'arrest': 'verb',
            'arrival': 'noun',
            'arrive': 'verb',
            'arrow': 'noun',
            'art': 'noun',
            'artificial': 'adjective',
            'artist': 'noun',
            'artistic': 'adjective',
            'as': 'conjunction',
            'ash': 'noun',
            'ashamed': 'adjective',
            'ashore': 'adverb',
            'Asia': 'noun',
            'Asian': 'adjective',
            'aside': 'adverb',
            'ask': 'verb',
            'asleep': 'adjective',
            'aspect': 'noun',
            'assassinate': 'verb',
            'assault': 'noun',
            'assemble': 'verb',
            'assembly': 'noun',
            'assert': 'verb',
            'assessment': 'noun',
            'assess': 'verb',
            'asset': 'noun',
            'assign': 'verb',
            'assignment': 'noun',
            'assist': 'verb',
            'assistance': 'noun',
            'assistant': 'noun',
            'associate': 'verb',
            'association': 'noun',
            'assume': 'verb',
            'assumption': 'noun',
            'assure': 'verb',
            'assurance': 'noun',
            'astonish': 'verb',
            'astonishing': 'adjective',
            'astronaut': 'noun',
            'astronomy': 'noun',
            'asynchronous': 'adjective',
            'at': 'preposition',
            'athlete': 'noun',
            'athletic': 'adjective',
            'atmosphere': 'noun',
            'atom': 'noun',
            'atomic': 'adjective',
            'attach': 'verb',
            'attack': 'verb',
            'attain': 'verb',
            'attempt': 'verb',
            'attention': 'noun',
            'attentive': 'adjective',
            'attitude': 'noun',
            'attract': 'verb',
            'attraction': 'noun',
            'attractive': 'adjective',
            'attribute': 'noun',
            'audience': 'noun',
            'audio': 'adjective',
            'audit': 'verb',
            'auditorium': 'noun',
            'august': 'noun',
            'aunt': 'noun',
            'author': 'noun',
            'authority': 'noun',
            'automatic': 'adjective',
            'automation': 'noun',
            'automobile': 'noun',
            'autonomous': 'adjective',
            'autumn': 'noun',
            'available': 'adjective',
            'avenue': 'noun',
            'average': 'adjective',
            'avoid': 'verb',
            'avoidance': 'noun',
            'aware': 'adjective',
            'awareness': 'noun',
            'away': 'adverb',
            'awesome': 'adjective',
            'awful': 'adjective',
            'awfully': 'adverb',
            'awkward': 'adjective',
            'axe': 'noun',
            'axle': 'noun',
            'baby': 'noun',
            'back': 'noun',
            'background': 'noun',
            'bad': 'adjective',
            'badly': 'adverb',
            'bag': 'noun',
            'baggage': 'noun',
            'bake': 'verb',
            'balance': 'noun',
            'ball': 'noun',
            'balloon': 'noun',
            'banana': 'noun',
            'band': 'noun',
            'bank': 'noun',
            'bar': 'noun',
            'bare': 'adjective',
            'bargain': 'noun',
            'barrier': 'noun',
            'base': 'noun',
            'basic': 'adjective',
            'basically': 'adverb',
            'basis': 'noun',
            'basket': 'noun',
            'CD': 'noun',
            'car': 'noun',
            'carbon': 'noun',
            'card': 'noun',
            'care': 'verb',
            'careful': 'adjective',
            'careless': 'adjective',
            'carpet': 'noun',
            'carrier': 'noun',
            'carrot': 'noun',
            'carry': 'verb',
            'cartoon': 'noun',
            'case': 'noun',
            'cash': 'noun',
            'castle': 'noun',
            'cat': 'noun',
            'catch': 'verb',
            'cattle': 'noun',
            'cause': 'noun',
            'cautious': 'adjective',
            'cave': 'noun',
            'ceiling': 'noun',
            'celebrate': 'verb',
            'cent': 'noun'
        };
        
        // 为单词添加词性信息
        return words.map(word => ({
            ...word,
            partOfSpeech: partOfSpeechMap[word.word] || 'unknown',
            difficulty: this.calculateDifficulty(word.word)
        }));
    }
    
    // 计算单词难度
    calculateDifficulty(word) {
        const length = word.length;
        if (length <= 3) return 'easy';
        if (length <= 6) return 'medium';
        return 'hard';
    }

    // 暂停单词音频
    pauseWordAudio() {
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }

    // 显示当前单词
    showCurrentWord() {
        const currentWordElement = document.getElementById('current-word');
        if (currentWordElement && this.words.length > 0) {
            const currentWord = this.words[this.currentWordIndex];
            
            // 添加淡出动画
            currentWordElement.style.opacity = '0';
            currentWordElement.style.transform = 'translateY(20px)';
            currentWordElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // 等待动画完成后更新内容
            setTimeout(() => {
                currentWordElement.innerHTML = `
                    <h3 class="word">${currentWord.word}</h3>
                    <p class="phonetic">${currentWord.phonetic}</p>
                    <p class="meaning">${currentWord.meaning}</p>
                    ${currentWord.example ? `<p class="example">${currentWord.example}</p>` : ''}
                    <div class="word-audio">
                        <button class="btn btn-sm btn-premium play-audio" data-word="${currentWord.word}">
                            <i class="fas fa-volume-up"></i> 发音
                        </button>
                    </div>
                    <div class="word-actions">
                        <button class="btn btn-primary" id="know-btn">认识</button>
                        <button class="btn btn-secondary" id="unknown-btn">不认识</button>
                    </div>
                `;
                
                // 添加淡入动画
                currentWordElement.style.opacity = '1';
                currentWordElement.style.transform = 'translateY(0)';
                
                // 重新绑定按钮事件
                this.setupWordActions();
                this.bindAudioPlayButtons();
            }, 300);
        }
    }

    // 设置单词操作按钮事件
    setupWordActions() {
        const knowBtn = document.getElementById('know-btn');
        const unknownBtn = document.getElementById('unknown-btn');
        
        if (knowBtn) {
            knowBtn.addEventListener('click', () => {
                this.markAsKnown();
            });
        }
        
        if (unknownBtn) {
            unknownBtn.addEventListener('click', () => {
                this.markAsUnknown();
            });
        }
    }

    // 标记为认识
    markAsKnown() {
        if (this.words.length > 0) {
            const currentWord = this.words[this.currentWordIndex];
            this.learnedWords.add(currentWord.word);
            this.saveLearnedWords();
            this.updateWordMemoryStrength(currentWord.word, 1);
            this.awardPoints(5);
            this.nextWord();
        }
    }

    // 标记为不认识
    markAsUnknown() {
        if (this.words.length > 0) {
            const currentWord = this.words[this.currentWordIndex];
            this.unknownWords.add(currentWord.word);
            this.saveUnknownWords();
            this.updateWordMemoryStrength(currentWord.word, -1);
            this.nextWord();
        }
    }

    // 更新单词记忆强度
    updateWordMemoryStrength(word, delta) {
        const currentStrength = this.wordMemoryStrength.get(word) || 0;
        const newStrength = Math.max(0, currentStrength + delta);
        this.wordMemoryStrength.set(word, newStrength);
        this.saveWordMemoryStrength();
        this.updateWordReviewTime(word, newStrength);
    }

    // 更新单词复习时间
    updateWordReviewTime(word, strength) {
        const reviewTimes = JSON.parse(localStorage.getItem('wordReviewTimes') || '{}');
        const intervalDays = this.calculateReviewInterval(strength);
        const nextReviewTime = new Date();
        nextReviewTime.setDate(nextReviewTime.getDate() + intervalDays);
        reviewTimes[word] = nextReviewTime.getTime();
        localStorage.setItem('wordReviewTimes', JSON.stringify(reviewTimes));
    }

    // 计算复习间隔
    calculateReviewInterval(strength) {
        const intervals = [1, 3, 7, 14, 30];
        return intervals[Math.min(strength, intervals.length - 1)];
    }

    // 获取需要复习的单词
    getWordsForReview() {
        const reviewTimes = JSON.parse(localStorage.getItem('wordReviewTimes') || '{}');
        const now = Date.now();
        const wordsToReview = [];
        
        for (const [word, reviewTime] of Object.entries(reviewTimes)) {
            if (now >= parseInt(reviewTime)) {
                const wordData = this.words.find(w => w.word === word);
                if (wordData) {
                    wordsToReview.push(wordData);
                }
            }
        }
        
        return wordsToReview;
    }

    // 显示复习单词
    showReviewWords() {
        const reviewWords = this.getWordsForReview();
        const reviewContainer = document.getElementById('review-section-content');
        
        if (reviewContainer) {
            if (reviewWords.length === 0) {
                reviewContainer.innerHTML = '<p class="text-center">暂无需要复习的单词</p>';
                return;
            }
            
            reviewContainer.innerHTML = '';
            reviewWords.forEach((word, index) => {
                const wordCard = document.createElement('div');
                wordCard.className = 'word-card';
                wordCard.style.marginBottom = '20px';
                wordCard.style.padding = '20px';
                wordCard.style.borderRadius = '12px';
                wordCard.style.backgroundColor = 'white';
                wordCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                wordCard.innerHTML = `
                    <h4>${word.word}</h4>
                    <p class="text-muted">${word.phonetic}</p>
                    <p>${word.meaning}</p>
                    ${word.example ? `<p class="text-muted italic">${word.example}</p>` : ''}
                    <div class="mt-3">
                        <button class="btn btn-sm btn-primary review-know" data-word="${word.word}">认识</button>
                        <button class="btn btn-sm btn-secondary review-unknown" data-word="${word.word}">不认识</button>
                    </div>
                `;
                reviewContainer.appendChild(wordCard);
            });
            
            this.bindReviewButtons();
        }
    }

    // 绑定复习按钮事件
    bindReviewButtons() {
        const reviewContainer = document.getElementById('review-section-content');
        if (reviewContainer) {
            reviewContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('review-know')) {
                    const word = e.target.getAttribute('data-word');
                    this.markReviewAsKnown(word);
                } else if (e.target.classList.contains('review-unknown')) {
                    const word = e.target.getAttribute('data-word');
                    this.markReviewAsUnknown(word);
                }
            });
        }
    }

    // 标记复习为认识
    markReviewAsKnown(word) {
        this.updateWordMemoryStrength(word, 1);
        this.awardPoints(2);
        this.showReviewWords();
    }

    // 标记复习为不认识
    markReviewAsUnknown(word) {
        this.updateWordMemoryStrength(word, -1);
        this.showReviewWords();
    }

    // 下一个单词
    nextWord() {
        this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
        this.saveCurrentWordIndex();
        this.showCurrentWord();
    }

    // 设置标签页
    setupTabs() {
        const vocabularyTabs = document.querySelectorAll('.vocabulary-tabs .tab-btn');
        vocabularyTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 移除所有活动状态
                vocabularyTabs.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 添加活动状态
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
                
                // 当切换到复习标签时，显示复习单词
                if (tabId === 'review-section') {
                    this.showReviewWords();
                }
                // 当切换到生词本标签时，显示生词本
                if (tabId === 'unknown-words') {
                    this.showUnknownWords();
                }
                // 当切换到单词探索标签时，初始化探索功能
                if (tabId === 'word-explorer') {
                    this.setupWordExplorer();
                }
                // 当切换到句乐部标签时，初始化句乐部功能
                if (tabId === 'sentence-club') {
                    this.setupSentenceClub();
                }
            });
        });
    }

    // 显示生词本
    showUnknownWords() {
        const unknownWordsList = document.getElementById('unknown-words-list');
        if (unknownWordsList) {
            if (this.unknownWords.size === 0) {
                unknownWordsList.innerHTML = '<p class="text-center">生词本为空</p>';
                return;
            }
            
            unknownWordsList.innerHTML = '';
            [...this.unknownWords].forEach(word => {
                const wordData = this.words.find(w => w.word === word);
                if (wordData) {
                    const wordCard = document.createElement('div');
                    wordCard.className = 'word-card';
                    wordCard.style.marginBottom = '15px';
                    wordCard.style.padding = '15px';
                    wordCard.style.borderRadius = '8px';
                    wordCard.style.backgroundColor = 'white';
                    wordCard.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    wordCard.innerHTML = `
                        <h4>${wordData.word}</h4>
                        <p class="text-muted">${wordData.phonetic}</p>
                        <p>${wordData.meaning}</p>
                        ${wordData.example ? `<p class="text-muted italic">${wordData.example}</p>` : ''}
                        <div class="mt-2">
                            <button class="btn btn-sm btn-primary remove-unknown" data-word="${wordData.word}">移除</button>
                        </div>
                    `;
                    unknownWordsList.appendChild(wordCard);
                }
            });
            
            // 绑定移除按钮事件
            this.bindRemoveUnknownButtons();
        }
    }

    // 绑定移除生词按钮事件
    bindRemoveUnknownButtons() {
        const unknownWordsList = document.getElementById('unknown-words-list');
        if (unknownWordsList) {
            unknownWordsList.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-unknown')) {
                    const word = e.target.getAttribute('data-word');
                    this.removeFromUnknownWords(word);
                }
            });
        }
    }

    // 从生词本移除单词
    removeFromUnknownWords(word) {
        this.unknownWords.delete(word);
        this.saveUnknownWords();
        this.showUnknownWords();
    }

    // 设置单词探索
    setupWordExplorer() {
        const exploreButton = document.getElementById('explore-new-word');
        const exploreResult = document.getElementById('explore-result');
        
        if (exploreButton && exploreResult) {
            exploreButton.addEventListener('click', () => {
                const exploreCategory = document.getElementById('explore-category').value;
                const exploredWord = this.getExploredWord(exploreCategory);
                
                if (exploredWord) {
                    exploreResult.innerHTML = `
                        <div class="word-card premium">
                            <div class="word-card-header">
                                <div class="word-info">
                                    <h3 class="word">${exploredWord.word}</h3>
                                    <p class="phonetic">${exploredWord.phonetic}</p>
                                    <div class="word-meta">
                                        <span class="pos-tag">${exploredWord.partOfSpeech || '未知'}</span>
                                        <span class="difficulty-badge">${exploredWord.difficulty || '中等'}</span>
                                    </div>
                                </div>
                                <button class="play-audio-btn" data-word="${exploredWord.word}">
                                    <i class="fas fa-volume-up"></i>
                                </button>
                            </div>
                            <div class="word-card-body">
                                <p class="meaning">${exploredWord.meaning}</p>
                                ${exploredWord.example ? `<div class="example"><small>${exploredWord.example}</small></div>` : ''}
                            </div>
                            <div class="word-card-footer">
                                <div class="word-actions">
                                    <button class="btn btn-primary add-to-known" data-word="${exploredWord.word}">认识</button>
                                    <button class="btn btn-secondary add-to-unknown" data-word="${exploredWord.word}">不认识</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // 绑定音频播放按钮
                    this.bindAudioPlayButtons();
                    
                    // 绑定探索单词的操作按钮
                    this.bindExploreWordButtons();
                }
            });
        }
    }

    // 获取探索单词
    getExploredWord(category) {
        let filteredWords = [...this.words];
        
        switch (category) {
            case 'random':
                return filteredWords[Math.floor(Math.random() * filteredWords.length)];
            case 'popular':
                // 简单实现：返回前100个单词
                return filteredWords.slice(0, 100)[Math.floor(Math.random() * 100)];
            case 'difficult':
                // 简单实现：返回长度大于6的单词
                const difficultWords = filteredWords.filter(word => word.word.length > 6);
                return difficultWords[Math.floor(Math.random() * difficultWords.length)];
            case 'recent':
                // 简单实现：返回后100个单词
                return filteredWords.slice(-100)[Math.floor(Math.random() * 100)];
            default:
                return filteredWords[Math.floor(Math.random() * filteredWords.length)];
        }
    }

    // 绑定探索单词的操作按钮
    bindExploreWordButtons() {
        const exploreResult = document.getElementById('explore-result');
        if (exploreResult) {
            exploreResult.addEventListener('click', (e) => {
                if (e.target.classList.contains('add-to-known')) {
                    const word = e.target.getAttribute('data-word');
                    this.learnedWords.add(word);
                    this.saveLearnedWords();
                    alert(`已将 ${word} 添加到已学单词`);
                } else if (e.target.classList.contains('add-to-unknown')) {
                    const word = e.target.getAttribute('data-word');
                    this.unknownWords.add(word);
                    this.saveUnknownWords();
                    alert(`已将 ${word} 添加到生词本`);
                }
            });
        }
    }

    // 设置导出导入功能
    setupExportImport() {
        const exportBtn = document.getElementById('export-unknown-words');
        const clearBtn = document.getElementById('clear-unknown-words');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUnknownWords();
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('确定要清空生词本吗？')) {
                    this.unknownWords.clear();
                    this.saveUnknownWords();
                    this.showUnknownWords();
                }
            });
        }
    }

    // 导出生词本
    exportUnknownWords() {
        if (this.unknownWords.size === 0) {
            alert('生词本为空，无法导出');
            return;
        }
        
        const unknownWordsArray = [...this.unknownWords].map(word => {
            const wordData = this.words.find(w => w.word === word);
            return wordData ? `${wordData.word}\t${wordData.phonetic}\t${wordData.meaning}` : word;
        });
        
        const content = '单词\t音标\t释义\n' + unknownWordsArray.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '生词本_' + new Date().toISOString().slice(0, 10) + '.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 加载已学单词
    loadLearnedWords() {
        const learned = localStorage.getItem('learnedWords');
        if (learned) {
            this.learnedWords = new Set(JSON.parse(learned));
        }
    }

    // 保存已学单词
    saveLearnedWords() {
        localStorage.setItem('learnedWords', JSON.stringify([...this.learnedWords]));
    }

    // 加载单词记忆强度
    loadWordMemoryStrength() {
        const memoryStrength = localStorage.getItem('wordMemoryStrength');
        if (memoryStrength) {
            this.wordMemoryStrength = new Map(JSON.parse(memoryStrength));
        }
    }

    // 保存单词记忆强度
    saveWordMemoryStrength() {
        localStorage.setItem('wordMemoryStrength', JSON.stringify([...this.wordMemoryStrength]));
    }

    // 更新统计信息
    updateStats() {
        const totalWords = document.getElementById('total-words');
        const learnedWords = document.getElementById('learned-words');
        const unknownWords = document.getElementById('unknown-words');
        const points = document.getElementById('points');
        
        if (totalWords) totalWords.textContent = this.words.length;
        if (learnedWords) learnedWords.textContent = this.learnedWords.size;
        if (unknownWords) unknownWords.textContent = this.unknownWords.size;
        if (points) points.textContent = this.points;
    }

    // 设置搜索功能
    setupSearch() {
        const searchInput = document.getElementById('word-search');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                const keyword = searchInput.value.trim();
                if (keyword) {
                    this.searchWords(keyword);
                }
            });
            
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const keyword = searchInput.value.trim();
                    if (keyword) {
                        this.searchWords(keyword);
                    }
                }
            });
        }
    }

    // 搜索单词
    searchWords(keyword) {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            const results = this.words.filter(word => 
                word.word.toLowerCase().includes(keyword.toLowerCase()) ||
                word.meaning.toLowerCase().includes(keyword.toLowerCase())
            );
            
            searchResults.innerHTML = '';
            results.forEach(word => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <h4>${word.word}</h4>
                    <p>${word.meaning}</p>
                `;
                searchResults.appendChild(resultItem);
            });
        }
    }

    // 加载单词数据
    loadWords() {
        // 尝试从缓存加载
        const cachedWords = localStorage.getItem('cachedWords');
        if (cachedWords) {
            try {
                console.log('Loading words from cache');
                const words = JSON.parse(cachedWords);
                // 确保单词数据包含词性信息
                return this.enhanceWordsWithPartOfSpeech(words);
            } catch (error) {
                console.error('Error loading words from cache:', error);
            }
        }
        
        // 导入3500词库数据
        if (typeof vocabulary3500 !== 'undefined') {
            console.log('Loading words from 3500 vocabulary');
            const words = vocabulary3500.words;
            // 保存到缓存
            localStorage.setItem('cachedWords', JSON.stringify(words));
            // 确保单词数据包含词性信息
            return this.enhanceWordsWithPartOfSpeech(words);
        }
        
        // 备用单词数据
        const words = [
            // A开头的单词
            { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', example: 'I eat an apple every day.' },
            { word: 'apply', phonetic: '/əˈplaɪ/', meaning: '应用，申请', example: 'I need to apply for a job.' },
            { word: 'apartment', phonetic: '/əˈpɑːtmənt/', meaning: '公寓', example: 'He lives in a small apartment.' },
            { word: 'ability', phonetic: '/əˈbɪləti/', meaning: '能力', example: 'She has the ability to speak three languages.' },
            { word: 'able', phonetic: '/ˈeɪbl/', meaning: '能够的', example: 'I am able to help you.' },
            { word: 'about', phonetic: '/əˈbaʊt/', meaning: '关于', example: 'Tell me about your day.' },
            { word: 'above', phonetic: '/əˈbʌv/', meaning: '在...上面', example: 'The bird is flying above the tree.' },
            { word: 'abroad', phonetic: '/əˈbrɔːd/', meaning: '在国外', example: 'She studied abroad for a year.' },
            { word: 'absence', phonetic: '/ˈæbsəns/', meaning: '缺席', example: 'His absence was noticed.' },
            { word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: '绝对的', example: 'That\'s an absolute truth.' },
            { word: 'absorb', phonetic: '/əbˈsɔːb/', meaning: '吸收', example: 'The sponge absorbs water.' },
            { word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: '抽象的', example: 'Abstract art can be difficult to understand.' },
            { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: '丰富的', example: 'The region has abundant natural resources.' },
            { word: 'abuse', phonetic: '/əˈbjuːs/', meaning: '滥用', example: 'Drug abuse is a serious problem.' },
            { word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: '学术的', example: 'She has an academic background.' },
            { word: 'accept', phonetic: '/əkˈsept/', meaning: '接受', example: 'I accept your invitation.' },
            { word: 'access', phonetic: '/ˈækses/', meaning: '进入', example: 'You need a key to access the building.' },
            { word: 'accident', phonetic: '/ˈæksɪdənt/', meaning: '事故', example: 'He was injured in a car accident.' },
            { word: 'accompany', phonetic: '/əˈkʌmpəni/', meaning: '陪伴', example: 'I will accompany you to the store.' },
            { word: 'according', phonetic: '/əˈkɔːdɪŋ/', meaning: '根据', example: 'According to the weather forecast, it will rain.' },
            { word: 'account', phonetic: '/əˈkaʊnt/', meaning: '账户，描述', example: 'I have a bank account.' },
            { word: 'accurate', phonetic: '/ˈækjərət/', meaning: '准确的', example: 'The information is accurate.' },
            { word: 'accuse', phonetic: '/əˈkjuːz/', meaning: '指责', example: 'He accused her of lying.' },
            { word: 'ache', phonetic: '/eɪk/', meaning: '疼痛', example: 'My head aches.' },
            { word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: '实现', example: 'She achieved her goal.' },
            { word: 'achievement', phonetic: '/əˈtʃiːvmənt/', meaning: '成就', example: 'His achievements are impressive.' },
            { word: 'acid', phonetic: '/ˈæsɪd/', meaning: '酸', example: 'Lemon juice is acid.' },
            { word: 'acquaintance', phonetic: '/əˈkweɪntəns/', meaning: '熟人', example: 'He is just an acquaintance.' },
            { word: 'acquire', phonetic: '/əˈkwaɪə/', meaning: '获得', example: 'She acquired a new skill.' },
            { word: 'across', phonetic: '/əˈkrɒs/', meaning: '穿过', example: 'Walk across the street.' },
            { word: 'act', phonetic: '/ækt/', meaning: '行动，表演', example: 'He acts in movies.' },
            { word: 'action', phonetic: '/ˈækʃn/', meaning: '行动', example: 'We need to take action.' },
            { word: 'active', phonetic: '/ˈæktɪv/', meaning: '活跃的', example: 'She is an active member.' },
            { word: 'activity', phonetic: '/ækˈtɪvəti/', meaning: '活动', example: 'There are many activities.' },
            { word: 'actor', phonetic: '/ˈæktə/', meaning: '演员', example: 'He is a famous actor.' },
            { word: 'actress', phonetic: '/ˈæktrəs/', meaning: '女演员', example: 'She is a talented actress.' },
            { word: 'actual', phonetic: '/ˈæktʃuəl/', meaning: '实际的', example: 'The actual cost is higher.' },
            { word: 'actually', phonetic: '/ˈæktʃuəli/', meaning: '实际上', example: 'Actually, I don\'t know.' },
            { word: 'acute', phonetic: '/əˈkjuːt/', meaning: '敏锐的，严重的', example: 'He has an acute sense of smell.' },
            { word: 'adapt', phonetic: '/əˈdæpt/', meaning: '适应', example: 'She adapted quickly.' },
            { word: 'adaptation', phonetic: '/ˌædæpˈteɪʃn/', meaning: '适应，改编', example: 'The adaptation was successful.' },
            { word: 'add', phonetic: '/æd/', meaning: '添加', example: 'Add some sugar.' },
            { word: 'addition', phonetic: '/əˈdɪʃn/', meaning: '加法，增加', example: 'The addition of new students.' },
            { word: 'additional', phonetic: '/əˈdɪʃənl/', meaning: '额外的', example: 'We need additional help.' },
            { word: 'address', phonetic: '/əˈdres/', meaning: '地址，演讲', example: 'What\'s your address?' },
            { word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: '足够的', example: 'The food is adequate.' },
            { word: 'adjust', phonetic: '/əˈdʒʌst/', meaning: '调整', example: 'Adjust the temperature.' },
            { word: 'adjustment', phonetic: '/əˈdʒʌstmənt/', meaning: '调整', example: 'The adjustment was easy.' },
            { word: 'administration', phonetic: '/ədˌmɪnɪˈstreɪʃn/', meaning: '管理，行政', example: 'The administration is efficient.' },
            { word: 'admire', phonetic: '/ədˈmaɪə/', meaning: '钦佩', example: 'I admire her courage.' },
            { word: 'admit', phonetic: '/ədˈmɪt/', meaning: '承认', example: 'He admitted his mistake.' },
            { word: 'adopt', phonetic: '/əˈdɒpt/', meaning: '采用，收养', example: 'They adopted a child.' },
            { word: 'adult', phonetic: '/ˈædʌlt/', meaning: '成年人', example: 'He is an adult.' },
            { word: 'advance', phonetic: '/ədˈvɑːns/', meaning: '前进，提前', example: 'We advanced quickly.' },
            { word: 'advanced', phonetic: '/ədˈvɑːnst/', meaning: '先进的', example: 'The technology is advanced.' },
            { word: 'advantage', phonetic: '/ədˈvɑːntɪdʒ/', meaning: '优势', example: 'He has an advantage.' },
            { word: 'adventure', phonetic: '/ədˈventʃə/', meaning: '冒险', example: 'They went on an adventure.' },
            { word: 'advertise', phonetic: '/ˈædvətaɪz/', meaning: '广告', example: 'They advertise their products.' },
            { word: 'advertisement', phonetic: '/ədˈvɜːtɪsmənt/', meaning: '广告', example: 'I saw an advertisement.' },
            { word: 'advice', phonetic: '/ədˈvaɪs/', meaning: '建议', example: 'He gave me good advice.' },
            { word: 'advise', phonetic: '/ədˈvaɪz/', meaning: '建议', example: 'I advise you to wait.' },
            { word: 'aeroplane', phonetic: '/ˈeərəpleɪn/', meaning: '飞机', example: 'We took an aeroplane.' },
            { word: 'affair', phonetic: '/əˈfeə/', meaning: '事务', example: 'It\'s a private affair.' },
            { word: 'affect', phonetic: '/əˈfekt/', meaning: '影响', example: 'The weather affects us.' },
            { word: 'affection', phonetic: '/əˈfekʃn/', meaning: '感情', example: 'She has affection for him.' },
            { word: 'afford', phonetic: '/əˈfɔːd/', meaning: '负担得起', example: 'I can afford it.' },
            { word: 'afraid', phonetic: '/əˈfreɪd/', meaning: '害怕的', example: 'I am afraid of dogs.' },
            { word: 'Africa', phonetic: '/ˈæfrɪkə/', meaning: '非洲', example: 'Africa is a continent.' },
            { word: 'African', phonetic: '/ˈæfrɪkən/', meaning: '非洲的', example: 'He is African.' },
            { word: 'after', phonetic: '/ˈɑːftə/', meaning: '在...之后', example: 'After lunch, we left.' },
            { word: 'afternoon', phonetic: '/ˌɑːftəˈnuːn/', meaning: '下午', example: 'Good afternoon!' },
            { word: 'afterwards', phonetic: '/ˈɑːftəwədz/', meaning: '后来', example: 'We met afterwards.' },
            { word: 'again', phonetic: '/əˈɡen/', meaning: '再次', example: 'Try again.' },
            { word: 'against', phonetic: '/əˈɡenst/', meaning: '反对', example: 'He is against it.' },
            { word: 'age', phonetic: '/eɪdʒ/', meaning: '年龄', example: 'What\'s your age?' },
            { word: 'aged', phonetic: '/eɪdʒd/', meaning: '年老的', example: 'An aged man.' },
            { word: 'agency', phonetic: '/ˈeɪdʒənsi/', meaning: '机构', example: 'Travel agency.' },
            { word: 'agent', phonetic: '/ˈeɪdʒənt/', meaning: '代理人', example: 'He is an agent.' },
            { word: 'aggressive', phonetic: '/əˈɡresɪv/', meaning: '侵略性的', example: 'He is aggressive.' },
            { word: 'ago', phonetic: '/əˈɡəʊ/', meaning: '以前', example: 'Three years ago.' },
            { word: 'agree', phonetic: '/əˈɡriː/', meaning: '同意', example: 'I agree with you.' },
            { word: 'agreement', phonetic: '/əˈɡriːmənt/', meaning: '协议', example: 'We have an agreement.' },
            { word: 'agriculture', phonetic: '/ˈæɡrɪkʌltʃə/', meaning: '农业', example: 'Agriculture is important.' },
            { word: 'ahead', phonetic: '/əˈhed/', meaning: '在前面', example: 'He is ahead of us.' },
            { word: 'aid', phonetic: '/eɪd/', meaning: '帮助', example: 'We need aid.' },
            { word: 'aim', phonetic: '/eɪm/', meaning: '目标，瞄准', example: 'What\'s your aim?' },
            { word: 'air', phonetic: '/eə/', meaning: '空气', example: 'The air is fresh.' },
            { word: 'aircraft', phonetic: '/ˈeəkrɑːft/', meaning: '飞机', example: 'The aircraft took off.' },
            { word: 'airline', phonetic: '/ˈeəlaɪn/', meaning: '航空公司', example: 'Which airline do you use?' },
            { word: 'airport', phonetic: '/ˈeəpɔːt/', meaning: '机场', example: 'We went to the airport.' },
            { word: 'airspace', phonetic: '/ˈeəspeɪs/', meaning: '领空', example: 'The airspace is restricted.' },
            { word: 'alarm', phonetic: '/əˈlɑːm/', meaning: '警报', example: 'The alarm went off.' },
            { word: 'album', phonetic: '/ˈælbəm/', meaning: '相册', example: 'I have a photo album.' },
            { word: 'alcohol', phonetic: '/ˈælkəhɒl/', meaning: '酒精', example: 'Alcohol is harmful.' },
            { word: 'alcoholic', phonetic: '/ˌælkəˈhɒlɪk/', meaning: '酒精的', example: 'He is an alcoholic.' },
            { word: 'algebra', phonetic: '/ˈældʒɪbrə/', meaning: '代数', example: 'I study algebra.' },
            { word: 'alike', phonetic: '/əˈlaɪk/', meaning: '相似的', example: 'They look alike.' },
            { word: 'alive', phonetic: '/əˈlaɪv/', meaning: '活着的', example: 'He is still alive.' },
            { word: 'all', phonetic: '/ɔːl/', meaning: '全部', example: 'All students are here.' },
            { word: 'alliance', phonetic: '/əˈlaɪəns/', meaning: '联盟', example: 'They formed an alliance.' },
            { word: 'allow', phonetic: '/əˈlaʊ/', meaning: '允许', example: 'My parents allow me.' },
            { word: 'allowance', phonetic: '/əˈlaʊəns/', meaning: '津贴', example: 'I get an allowance.' },
            { word: 'ally', phonetic: '/ˈælaɪ/', meaning: '盟友', example: 'They are allies.' },
            { word: 'almost', phonetic: '/ˈɔːlməʊst/', meaning: '几乎', example: 'Almost everyone came.' },
            { word: 'alone', phonetic: '/əˈləʊn/', meaning: '独自的', example: 'I am alone.' },
            { word: 'along', phonetic: '/əˈlɒŋ/', meaning: '沿着', example: 'Walk along the street.' },
            { word: 'aloud', phonetic: '/əˈlaʊd/', meaning: '大声地', example: 'Read aloud.' },
            { word: 'alphabet', phonetic: '/ˈælfəbet/', meaning: '字母表', example: 'Learn the alphabet.' },
            { word: 'already', phonetic: '/ɔːlˈredi/', meaning: '已经', example: 'I have already done it.' },
            { word: 'also', phonetic: '/ˈɔːlsəʊ/', meaning: '也', example: 'I also like it.' },
            { word: 'alternative', phonetic: '/ɔːlˈtɜːnətɪv/', meaning: '替代的', example: 'We have alternatives.' },
            { word: 'although', phonetic: '/ɔːlˈðəʊ/', meaning: '虽然', example: 'Although it rained, we went out.' },
            { word: 'altitude', phonetic: '/ˈæltɪtjuːd/', meaning: '高度', example: 'The altitude is high.' },
            { word: 'altogether', phonetic: '/ˌɔːltəˈɡeðə/', meaning: '总共', example: 'Altogether, it\'s $10.' },
            { word: 'always', phonetic: '/ˈɔːlweɪz/', meaning: '总是', example: 'He always helps.' },
            { word: 'am', phonetic: '/æm/', meaning: '是', example: 'I am happy.' },
            { word: 'amateur', phonetic: '/ˈæmətə/', meaning: '业余的', example: 'He is an amateur.' },
            { word: 'amaze', phonetic: '/əˈmeɪz/', meaning: '使惊讶', example: 'His skills amaze me.' },
            { word: 'amazing', phonetic: '/əˈmeɪzɪŋ/', meaning: '令人惊讶的', example: 'It\'s amazing.' },
            { word: 'ambassador', phonetic: '/æmˈbæsədə/', meaning: '大使', example: 'He is an ambassador.' },
            { word: 'ambition', phonetic: '/æmˈbɪʃn/', meaning: '野心', example: 'He has ambition.' },
            { word: 'ambitious', phonetic: '/æmˈbɪʃəs/', meaning: '有野心的', example: 'She is ambitious.' },
            { word: 'ambulance', phonetic: '/ˈæmbjələns/', meaning: '救护车', example: 'The ambulance arrived.' },
            { word: 'America', phonetic: '/əˈmerɪkə/', meaning: '美国', example: 'America is a country.' },
            { word: 'American', phonetic: '/əˈmerɪkən/', meaning: '美国的', example: 'He is American.' },
            { word: 'among', phonetic: '/əˈmʌŋ/', meaning: '在...之中', example: 'Among friends.' },
            { word: 'amount', phonetic: '/əˈmaʊnt/', meaning: '数量', example: 'A large amount.' },
            { word: 'ample', phonetic: '/ˈæmpl/', meaning: '充足的', example: 'We have ample time.' },
            { word: 'amplify', phonetic: '/ˈæmplɪfaɪ/', meaning: '放大', example: 'Amplify the sound.' },
            { word: 'amuse', phonetic: '/əˈmjuːz/', meaning: '娱乐', example: 'He amused us.' },
            { word: 'amusement', phonetic: '/əˈmjuːzmənt/', meaning: '娱乐', example: 'We had amusement.' },
            { word: 'analyze', phonetic: '/ˈænəlaɪz/', meaning: '分析', example: 'Analyze the data.' },
            { word: 'analysis', phonetic: '/əˈnæləsɪs/', meaning: '分析', example: 'The analysis is good.' },
            { word: 'ancestor', phonetic: '/ˈænsestə/', meaning: '祖先', example: 'Our ancestors.' },
            { word: 'anchor', phonetic: '/ˈæŋkə/', meaning: '锚', example: 'Drop the anchor.' },
            { word: 'ancient', phonetic: '/ˈeɪnʃənt/', meaning: '古代的', example: 'An ancient city.' },
            { word: 'and', phonetic: '/ænd/', meaning: '和', example: 'You and me.' },
            { word: 'anger', phonetic: '/ˈæŋɡə/', meaning: '愤怒', example: 'He felt anger.' },
            { word: 'angry', phonetic: '/ˈæŋɡri/', meaning: '生气的', example: 'She is angry.' },
            { word: 'animal', phonetic: '/ˈænɪml/', meaning: '动物', example: 'I like animals.' },
            { word: 'ankle', phonetic: '/ˈæŋkl/', meaning: '脚踝', example: 'I hurt my ankle.' },
            { word: 'anniversary', phonetic: '/ˌænɪˈvɜːsəri/', meaning: '周年', example: 'Wedding anniversary.' },
            { word: 'announce', phonetic: '/əˈnaʊns/', meaning: '宣布', example: 'Announce the news.' },
            { word: 'announcement', phonetic: '/əˈnaʊnsmənt/', meaning: '公告', example: 'Make an announcement.' },
            { word: 'annoy', phonetic: '/əˈnɔɪ/', meaning: '使烦恼', example: 'He annoys me.' },
            { word: 'annual', phonetic: '/ˈænjuəl/', meaning: '每年的', example: 'Annual meeting.' },
            { word: 'another', phonetic: '/əˈnʌðə/', meaning: '另一个', example: 'Another book.' },
            { word: 'answer', phonetic: '/ˈɑːnsə/', meaning: '回答', example: 'Answer the question.' },
            { word: 'ant', phonetic: '/ænt/', meaning: '蚂蚁', example: 'An ant is small.' },
            { word: 'anticipate', phonetic: '/ænˈtɪsɪpeɪt/', meaning: '预期', example: 'Anticipate the future.' },
            { word: 'antique', phonetic: '/ænˈtiːk/', meaning: '古董', example: 'An antique chair.' },
            { word: 'anxiety', phonetic: '/æŋˈzaɪəti/', meaning: '焦虑', example: 'She has anxiety.' },
            { word: 'anxious', phonetic: '/ˈæŋkʃəs/', meaning: '焦虑的', example: 'He is anxious.' },
            { word: 'any', phonetic: '/ˈeni/', meaning: '任何', example: 'Any questions?' },
            { word: 'anybody', phonetic: '/ˈenibɒdi/', meaning: '任何人', example: 'Anybody can do it.' },
            { word: 'anyhow', phonetic: '/ˈenɪhaʊ/', meaning: '无论如何', example: 'Anyhow, we tried.' },
            { word: 'anyone', phonetic: '/ˈeniwʌn/', meaning: '任何人', example: 'Does anyone know?' },
            { word: 'anything', phonetic: '/ˈeniθɪŋ/', meaning: '任何事', example: 'Do anything.' },
            { word: 'anyway', phonetic: '/ˈeniweɪ/', meaning: '无论如何', example: 'Anyway, it\'s done.' },
            { word: 'anywhere', phonetic: '/ˈeniweə/', meaning: '任何地方', example: 'Go anywhere.' },
            { word: 'apart', phonetic: '/əˈpɑːt/', meaning: '分开', example: 'They live apart.' },
            { word: 'apartment', phonetic: '/əˈpɑːtmənt/', meaning: '公寓', example: 'An apartment building.' },
            { word: 'apologize', phonetic: '/əˈpɒlədʒaɪz/', meaning: '道歉', example: 'Apologize to her.' },
            { word: 'apology', phonetic: '/əˈpɒlədʒi/', meaning: '道歉', example: 'Make an apology.' },
            { word: 'appear', phonetic: '/əˈpɪə/', meaning: '出现', example: 'He appeared.' },
            { word: 'appearance', phonetic: '/əˈpɪərəns/', meaning: '外表', example: 'His appearance changed.' },
            { word: 'appendix', phonetic: '/əˈpendɪks/', meaning: '附录', example: 'See the appendix.' },
            { word: 'applaud', phonetic: '/əˈplɔːd/', meaning: '鼓掌', example: 'Applaud the performance.' },
            { word: 'apple', phonetic: '/ˈæpl/', meaning: '苹果', example: 'An apple a day.' },
            { word: 'application', phonetic: '/ˌæplɪˈkeɪʃn/', meaning: '申请', example: 'Fill out the application.' },
            { word: 'apply', phonetic: '/əˈplaɪ/', meaning: '应用，申请', example: 'Apply for a job.' },
            { word: 'appoint', phonetic: '/əˈpɔɪnt/', meaning: '任命', example: 'Appoint a manager.' },
            { word: 'appointment', phonetic: '/əˈpɔɪntmənt/', meaning: '约会', example: 'Make an appointment.' },
            { word: 'appreciate', phonetic: '/əˈpriːʃieɪt/', meaning: '欣赏', example: 'I appreciate it.' },
            { word: 'approach', phonetic: '/əˈprəʊtʃ/', meaning: '接近', example: 'Approach the problem.' },
            { word: 'appropriate', phonetic: '/əˈprəʊpriət/', meaning: '适当的', example: 'Appropriate behavior.' },
            { word: 'approval', phonetic: '/əˈpruːvl/', meaning: '批准', example: 'Get approval.' },
            { word: 'approve', phonetic: '/əˈpruːv/', meaning: '批准', example: 'Approve the plan.' },
            { word: 'approximately', phonetic: '/əˈprɒksɪmətli/', meaning: '大约', example: 'Approximately 100.' },
            { word: 'apron', phonetic: '/ˈeɪprən/', meaning: '围裙', example: 'Wear an apron.' },
            { word: 'apt', phonetic: '/æpt/', meaning: '恰当的', example: 'An apt remark.' },
            { word: 'aptitude', phonetic: '/ˈæptɪtjuːd/', meaning: '天资', example: 'He has aptitude.' },
            { word: 'aquatic', phonetic: '/əˈkwætɪk/', meaning: '水生的', example: 'Aquatic plants.' },
            { word: 'arbitrary', phonetic: '/ˈɑːbɪtrəri/', meaning: '任意的', example: 'An arbitrary decision.' },
            { word: 'arch', phonetic: '/ɑːtʃ/', meaning: '拱门', example: 'A stone arch.' },
            { word: 'architect', phonetic: '/ˈɑːkɪtekt/', meaning: '建筑师', example: 'He is an architect.' },
            { word: 'architecture', phonetic: '/ˈɑːkɪtektʃə/', meaning: '建筑', example: 'Modern architecture.' },
            { word: 'area', phonetic: '/ˈeəriə/', meaning: '地区', example: 'In this area.' },
            { word: 'argue', phonetic: '/ˈɑːɡjuː/', meaning: '争论', example: 'Argue with him.' },
            { word: 'argument', phonetic: '/ˈɑːɡjumənt/', meaning: '论点', example: 'His argument is strong.' },
            { word: 'arise', phonetic: '/əˈraɪz/', meaning: '出现', example: 'A problem arose.' },
            { word: 'arm', phonetic: '/ɑːm/', meaning: '手臂', example: 'He has strong arms.' },
            { word: 'armchair', phonetic: '/ˈɑːmtʃeə/', meaning: '扶手椅', example: 'Sit in the armchair.' },
            { word: 'army', phonetic: '/ˈɑːmi/', meaning: '军队', example: 'Join the army.' },
            { word: 'around', phonetic: '/əˈraʊnd/', meaning: '在周围', example: 'Look around.' },
            { word: 'arrange', phonetic: '/əˈreɪndʒ/', meaning: '安排', example: 'Arrange the meeting.' },
            { word: 'arrangement', phonetic: '/əˈreɪndʒmənt/', meaning: '安排', example: 'The arrangement is good.' },
            { word: 'arrest', phonetic: '/əˈrest/', meaning: '逮捕', example: 'Arrest the criminal.' },
            { word: 'arrival', phonetic: '/əˈraɪvl/', meaning: '到达', example: 'The arrival time.' },
            { word: 'arrive', phonetic: '/əˈraɪv/', meaning: '到达', example: 'Arrive at the station.' },
            { word: 'arrow', phonetic: '/ˈærəʊ/', meaning: '箭头', example: 'Follow the arrow.' },
            { word: 'art', phonetic: '/ɑːt/', meaning: '艺术', example: 'I love art.' },
            { word: 'artificial', phonetic: '/ˌɑːtɪˈfɪʃl/', meaning: '人造的', example: 'Artificial flowers.' },
            { word: 'artist', phonetic: '/ˈɑːtɪst/', meaning: '艺术家', example: 'He is an artist.' },
            { word: 'artistic', phonetic: '/ɑːˈtɪstɪk/', meaning: '艺术的', example: 'Artistic talent.' },
            { word: 'as', phonetic: '/æz/', meaning: '作为', example: 'As a teacher.' },
            { word: 'ash', phonetic: '/æʃ/', meaning: '灰烬', example: 'The fire left ash.' },
            { word: 'ashamed', phonetic: '/əˈʃeɪmd/', meaning: '羞愧的', example: 'He felt ashamed.' },
            { word: 'ashore', phonetic: '/əˈʃɔː/', meaning: '在岸上', example: 'Come ashore.' },
            { word: 'Asia', phonetic: '/ˈeɪʒə/', meaning: '亚洲', example: 'Asia is a continent.' },
            { word: 'Asian', phonetic: '/ˈeɪʒn/', meaning: '亚洲的', example: 'He is Asian.' },
            { word: 'aside', phonetic: '/əˈsaɪd/', meaning: '在旁边', example: 'Put it aside.' },
            { word: 'ask', phonetic: '/ɑːsk/', meaning: '问', example: 'Ask a question.' },
            { word: 'asleep', phonetic: '/əˈsliːp/', meaning: '睡着的', example: 'He is asleep.' },
            { word: 'aspect', phonetic: '/ˈæspekt/', meaning: '方面', example: 'In this aspect.' },
            { word: 'assassinate', phonetic: '/əˈsæsɪneɪt/', meaning: '暗杀', example: 'Assassinate the leader.' },
            { word: 'assault', phonetic: '/əˈsɔːlt/', meaning: '攻击', example: 'An assault on the city.' },
            { word: 'assemble', phonetic: '/əˈsembl/', meaning: '集合', example: 'Assemble the team.' },
            { word: 'assembly', phonetic: '/əˈsembli/', meaning: '集会', example: 'School assembly.' },
            { word: 'assert', phonetic: '/əˈsɜːt/', meaning: '断言', example: 'Assert your rights.' },
            { word: 'assessment', phonetic: '/əˈsesmənt/', meaning: '评估', example: 'The assessment is fair.' },
            { word: 'assess', phonetic: '/əˈses/', meaning: '评估', example: 'Assess the damage.' },
            { word: 'asset', phonetic: '/ˈæset/', meaning: '资产', example: 'A valuable asset.' },
            { word: 'assign', phonetic: '/əˈsaɪn/', meaning: '分配', example: 'Assign tasks.' },
            { word: 'assignment', phonetic: '/əˈsaɪnmənt/', meaning: '作业', example: 'Do the assignment.' },
            { word: 'assist', phonetic: '/əˈsɪst/', meaning: '帮助', example: 'Assist the teacher.' },
            { word: 'assistance', phonetic: '/əˈsɪstəns/', meaning: '帮助', example: 'Provide assistance.' },
            { word: 'assistant', phonetic: '/əˈsɪstənt/', meaning: '助手', example: 'He is my assistant.' },
            { word: 'associate', phonetic: '/əˈsəʊsieɪt/', meaning: '联想', example: 'Associate with friends.' },
            { word: 'association', phonetic: '/əˌsəʊsiˈeɪʃn/', meaning: '协会', example: 'Join the association.' },
            { word: 'assume', phonetic: '/əˈsjuːm/', meaning: '假设', example: 'Assume it\'s true.' },
            { word: 'assumption', phonetic: '/əˈsʌmpʃn/', meaning: '假设', example: 'Make an assumption.' },
            { word: 'assure', phonetic: '/əˈʃʊə/', meaning: '保证', example: 'Assure him.' },
            { word: 'assurance', phonetic: '/əˈʃʊərəns/', meaning: '保证', example: 'Give assurance.' },
            { word: 'astonish', phonetic: '/əˈstɒnɪʃ/', meaning: '使惊讶', example: 'Astonish the audience.' },
            { word: 'astonishing', phonetic: '/əˈstɒnɪʃɪŋ/', meaning: '令人惊讶的', example: 'Astonishing news.' },
            { word: 'astronaut', phonetic: '/ˈæstrənɔːt/', meaning: '宇航员', example: 'He is an astronaut.' },
            { word: 'astronomy', phonetic: '/əˈstrɒnəmi/', meaning: '天文学', example: 'Study astronomy.' },
            { word: 'asynchronous', phonetic: '/eɪˈsɪŋkrənəs/', meaning: '异步的', example: 'Asynchronous communication.' },
            { word: 'at', phonetic: '/æt/', meaning: '在', example: 'At school.' },
            { word: 'athlete', phonetic: '/ˈæθliːt/', meaning: '运动员', example: 'He is an athlete.' },
            { word: 'athletic', phonetic: '/æθˈletɪk/', meaning: '运动的', example: 'Athletic ability.' },
            { word: 'atmosphere', phonetic: '/ˈætməsfɪə/', meaning: '大气', example: 'The atmosphere is clean.' },
            { word: 'atom', phonetic: '/ˈætəm/', meaning: '原子', example: 'An atom is small.' },
            { word: 'atomic', phonetic: '/əˈtɒmɪk/', meaning: '原子的', example: 'Atomic energy.' },
            { word: 'attach', phonetic: '/əˈtætʃ/', meaning: '附上', example: 'Attach the file.' },
            { word: 'attack', phonetic: '/əˈtæk/', meaning: '攻击', example: 'Attack the enemy.' },
            { word: 'attain', phonetic: '/əˈteɪn/', meaning: '达到', example: 'Attain the goal.' },
            { word: 'attempt', phonetic: '/əˈtempt/', meaning: '尝试', example: 'Attempt to do it.' },
            { word: 'attention', phonetic: '/əˈtenʃn/', meaning: '注意', example: 'Pay attention.' },
            { word: 'attentive', phonetic: '/əˈtentɪv/', meaning: '专心的', example: 'He is attentive.' },
            { word: 'attitude', phonetic: '/ˈætɪtjuːd/', meaning: '态度', example: 'Positive attitude.' },
            { word: 'attract', phonetic: '/əˈtrækt/', meaning: '吸引', example: 'Attract customers.' },
            { word: 'attraction', phonetic: '/əˈtrækʃn/', meaning: '吸引力', example: 'A tourist attraction.' },
            { word: 'attractive', phonetic: '/əˈtræktɪv/', meaning: '吸引人的', example: 'She is attractive.' },
            { word: 'attribute', phonetic: '/ˈætrɪbjuːt/', meaning: '属性', example: 'An attribute of life.' },
            { word: 'audience', phonetic: '/ˈɔːdiəns/', meaning: '观众', example: 'The audience clapped.' },
            { word: 'audio', phonetic: '/ˈɔːdiəʊ/', meaning: '音频', example: 'Audio equipment.' },
            { word: 'audit', phonetic: '/ˈɔːdɪt/', meaning: '审计', example: 'Audit the accounts.' },
            { word: 'auditorium', phonetic: '/ˌɔːdɪˈtɔːriəm/', meaning: '礼堂', example: 'In the auditorium.' },
            { word: 'august', phonetic: '/ˈɔːɡəst/', meaning: '八月', example: 'August is hot.' },
            { word: 'aunt', phonetic: '/ɑːnt/', meaning: '阿姨', example: 'My aunt is coming to visit.' }
        ];
        
        // 保存到缓存
        localStorage.setItem('cachedWords', JSON.stringify(words));
        // 确保单词数据包含词性信息
        return this.enhanceWordsWithPartOfSpeech(words);
    }
    
    // 单词探索功能
    setupWordExplorer() {
        const exploreBtn = document.getElementById('explore-new-word');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.exploreNewWord();
            });
        }
    }
    
    // 探索新单词
    exploreNewWord() {
        const category = document.getElementById('explore-category')?.value || 'random';
        let selectedWord;
        
        switch (category) {
            case 'random':
                // 随机选择一个单词
                selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
                break;
            case 'popular':
                // 选择常用单词（这里简化处理，实际应该基于使用频率）
                selectedWord = this.words[Math.floor(Math.random() * Math.min(100, this.words.length))];
                break;
            case 'difficult':
                // 选择较长的单词作为高难度
                const difficultWords = this.words.filter(word => word.word.length > 7);
                selectedWord = difficultWords[Math.floor(Math.random() * difficultWords.length)] || this.words[0];
                break;
            case 'recent':
                // 选择最近添加的单词（这里简化处理）
                selectedWord = this.words[this.words.length - 1];
                break;
            default:
                selectedWord = this.words[Math.floor(Math.random() * this.words.length)];
        }
        
        this.showExplorerResult(selectedWord);
    }
    
    // 显示探索结果
    showExplorerResult(word) {
        const resultContainer = document.getElementById('explore-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="word-card advanced">
                    <div class="word-card-header">
                        <div class="word-info">
                            <h3 class="word">${word.word}</h3>
                            <p class="phonetic">${word.phonetic}</p>
                            <div class="pos-tag">
                                <span class="pos-text">${word.partOfSpeech || 'noun'}</span>
                            </div>
                        </div>
                        <button class="play-audio-btn" data-word="${word.word}">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                    <div class="word-card-body">
                        <p class="meaning">${word.meaning}</p>
                        <div class="example">
                            <small>${word.example}</small>
                        </div>
                    </div>
                    <div class="word-card-footer">
                        <div class="word-actions">
                            <button class="btn btn-primary add-to-learned" data-word="${word.word}">
                                标记为已学
                            </button>
                            <button class="btn btn-secondary add-to-unknown" data-word="${word.word}">
                                添加到生词本
                            </button>
                        </div>
                        <div class="word-meta">
                            <span class="difficulty-badge">
                                ${word.word.length <= 4 ? '简单' : word.word.length <= 7 ? '中等' : '困难'}
                            </span>
                        </div>
                    </div>
                </div>
            `;
            
            // 绑定按钮事件
            this.bindExplorerButtons();
        }
    }
    
    // 绑定探索结果的按钮事件
    bindExplorerButtons() {
        document.querySelectorAll('.add-to-learned').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const word = e.target.getAttribute('data-word');
                if (word) {
                    this.learnedWords.add(word);
                    this.saveLearnedWords();
                    alert(`已将 ${word} 标记为已学`);
                }
            });
        });
        
        document.querySelectorAll('.add-to-unknown').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const word = e.target.getAttribute('data-word');
                if (word) {
                    this.unknownWords.add(word);
                    this.saveUnknownWords();
                    alert(`已将 ${word} 添加到生词本`);
                }
            });
        });
    }
    
    // 彩蛋功能
    setupEasterEgg() {
        const eggBtn = document.getElementById('vocabulary-egg');
        if (eggBtn) {
            let clickCount = 0;
            let animationFrame = null;
            
            eggBtn.addEventListener('click', () => {
                clickCount++;
                
                // 添加点击动画效果
                this.animateEggButton(eggBtn);
                
                if (clickCount >= 5) {
                    this.showEasterEgg();
                    clickCount = 0;
                }
            });
        }
    }
    
    // 彩蛋按钮动画
    animateEggButton(button) {
        button.style.transform = 'scale(1.2)';
        button.style.filter = 'brightness(1.2)';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
            button.style.filter = 'brightness(1)';
        }, 200);
    }
    
    // 显示彩蛋
    showEasterEgg() {
        // 创建彩蛋弹窗
        const easterEggModal = document.createElement('div');
        easterEggModal.id = 'easter-egg-modal';
        easterEggModal.className = 'easter-egg-modal';
        easterEggModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: easterEggFadeIn 0.5s ease-out;
        `;
        
        // 彩蛋内容
        easterEggModal.innerHTML = `
            <div class="easter-egg-content" style="
                background: linear-gradient(135deg, #ffffff, #f8f9fa);
                border-radius: 24px;
                padding: 60px;
                text-align: center;
                max-width: 600px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: easterEggSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            ">
                <div class="easter-egg-icon" style="
                    font-size: 6rem;
                    margin-bottom: 30px;
                    animation: easterEggBounce 2s ease-in-out infinite;
                ">
                    <i class="fas fa-lightbulb"></i>
                </div>
                <h2 style="
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                    background: linear-gradient(135deg, #4361ee, #3f37c9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">恭喜你发现了彩蛋！</h2>
                <p style="
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                    color: #6c757d;
                    line-height: 1.6;
                ">你是一个细心的学习者！继续保持这种探索精神，在英语学习的道路上不断前进。</p>
                <div class="easter-egg-image" style="
                    margin: 30px 0;
                    padding: 20px;
                    background: rgba(67, 97, 238, 0.05);
                    border-radius: 16px;
                    border: 1px solid rgba(67, 97, 238, 0.1);
                ">
                    <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cute%20black%20cat%20cartoon%20character%20with%20glowing%20eyes%2C%20magical%20atmosphere%2C%20simple%20clean%20design%2C%20colorful%20background&image_size=square" 
                         alt="罗小黑" 
                         style="
                             width: 200px;
                             height: 200px;
                             object-fit: contain;
                             animation: easterEggFloat 3s ease-in-out infinite;
                         ">
                </div>
                <div class="easter-egg-actions" style="
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin-top: 40px;
                ">
                    <button class="btn btn-primary" id="easter-egg-close" style="
                        padding: 12px 30px;
                        font-size: 1.1rem;
                        border-radius: 12px;
                        background: linear-gradient(135deg, #4361ee, #3f37c9);
                        border: none;
                        color: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        关闭
                    </button>
                    <button class="btn btn-secondary" id="easter-egg-explore" style="
                        padding: 12px 30px;
                        font-size: 1.1rem;
                        border-radius: 12px;
                        background: transparent;
                        border: 2px solid #4361ee;
                        color: #4361ee;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        探索更多
                    </button>
                </div>
                <div class="easter-egg-particles" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                "></div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(easterEggModal);
        
        // 添加动画样式
        this.addEasterEggAnimations();
        
        // 添加粒子效果
        this.createEasterEggParticles(easterEggModal.querySelector('.easter-egg-particles'));
        
        // 绑定关闭按钮事件
        const closeBtn = easterEggModal.querySelector('#easter-egg-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeEasterEgg(easterEggModal);
            });
        }
        
        // 绑定探索更多按钮事件
        const exploreBtn = easterEggModal.querySelector('#easter-egg-explore');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                // 跳转到单词探索页面
                const exploreTab = document.querySelector('.tab-btn[data-tab="word-explorer"]');
                if (exploreTab) {
                    exploreTab.click();
                }
                this.closeEasterEgg(easterEggModal);
            });
        }
        
        // 点击背景关闭
        easterEggModal.addEventListener('click', (e) => {
            if (e.target === easterEggModal) {
                this.closeEasterEgg(easterEggModal);
            }
        });
        
        // 解锁彩蛋成就
        this.unlockEasterEggAchievement();
    }
    
    // 添加彩蛋动画样式
    addEasterEggAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes easterEggFadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
            
            @keyframes easterEggSlideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8) translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
            }
            
            @keyframes easterEggBounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-20px);
                }
                60% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes easterEggFloat {
                0%, 100% {
                    transform: translateY(0) rotate(0deg);
                }
                50% {
                    transform: translateY(-15px) rotate(5deg);
                }
            }
            
            @keyframes easterEggParticle {
                0% {
                    opacity: 1;
                    transform: scale(1) translateY(0);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-100px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 创建彩蛋粒子效果
    createEasterEggParticles(container) {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: rgba(67, 97, 238, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: easterEggParticle ${Math.random() * 3 + 2}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(particle);
        }
    }
    
    // 关闭彩蛋
    closeEasterEgg(modal) {
        modal.style.animation = 'easterEggFadeIn 0.5s ease-out reverse';
        setTimeout(() => {
            modal.remove();
        }, 500);
    }
    
    // 解锁彩蛋成就
    unlockEasterEggAchievement() {
        // 这里可以添加解锁成就的逻辑
        if (typeof reward !== 'undefined') {
            // 假设reward系统有解锁成就的方法
            // reward.unlockAchievement('easter_egg_explorer');
        }
        
        // 保存彩蛋解锁状态到localStorage
        localStorage.setItem('easterEggUnlocked', 'true');
    }
    
    // 显示彩蛋
    showEasterEgg() {
        // 创建彩蛋弹窗
        const popup = document.createElement('div');
        popup.className = 'vocabulary-egg-popup';
        popup.innerHTML = `
            <div class="egg-content">
                <button class="egg-close">&times;</button>
                <h3>🎉 词汇大师彩蛋</h3>
                <p>恭喜你发现了词汇学习的隐藏彩蛋！继续努力学习，你将成为真正的词汇大师！</p>
                <p>🎉 获得成就：彩蛋发现者</p>
                <div>
                    <button class="btn btn-primary egg-continue">继续学习</button>
                    <button class="btn btn-secondary egg-close-btn">关闭</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        
        // 显示弹窗
        setTimeout(() => {
            popup.classList.add('show');
        }, 100);
        
        // 绑定关闭事件
        popup.querySelector('.egg-close').addEventListener('click', () => {
            this.closeEasterEgg(popup);
        });
        
        popup.querySelector('.egg-close-btn').addEventListener('click', () => {
            this.closeEasterEgg(popup);
        });
        
        popup.querySelector('.egg-continue').addEventListener('click', () => {
            this.closeEasterEgg(popup);
        });
        
        // 点击遮罩关闭
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                this.closeEasterEgg(popup);
            }
        });
    }
    
    // 关闭彩蛋
    closeEasterEgg(popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 400);
    }
    
    // 导出导入功能
    setupExportImport() {
        const exportBtn = document.getElementById('export-unknown-words');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportUnknownWords();
            });
        }
        
        const clearBtn = document.getElementById('clear-unknown-words');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('确定要清空生词本吗？')) {
                    this.unknownWords.clear();
                    this.saveUnknownWords();
                    this.showUnknownWords();
                    alert('生词本已清空');
                }
            });
        }
    }
    
    // 导出生词本
    exportUnknownWords() {
        if (this.unknownWords.size === 0) {
            alert('生词本为空，没有可导出的内容');
            return;
        }
        
        const unknownWordsArray = Array.from(this.unknownWords);
        const wordDetails = unknownWordsArray.map(word => {
            const wordObj = this.words.find(w => w.word === word);
            return wordObj ? `${wordObj.word} - ${wordObj.meaning} (${wordObj.phonetic})` : word;
        });
        
        const content = wordDetails.join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生词本_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 丰富词汇学习功能
    enrichVocabularyFeatures() {
        this.setupWordNotes();
        this.setupLearningStatistics();
        this.setupWordCategories();
        this.setupWordReviewReminders();
    }
    
    // 设置单词笔记功能
    setupWordNotes() {
        // 为单词卡片添加笔记按钮
        const wordCards = document.querySelectorAll('.word-card');
        wordCards.forEach(card => {
            const word = card.querySelector('.word')?.textContent;
            if (word && !card.querySelector('.note-btn')) {
                const footer = card.querySelector('.word-card-footer');
                if (footer) {
                    const noteBtn = document.createElement('button');
                    noteBtn.className = 'btn btn-secondary note-btn';
                    noteBtn.innerHTML = '<i class="fas fa-sticky-note"></i> 笔记';
                    noteBtn.setAttribute('data-word', word);
                    footer.querySelector('.word-actions').appendChild(noteBtn);
                }
            }
        });
        
        // 绑定笔记按钮事件
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const word = e.target.closest('.note-btn').getAttribute('data-word');
                this.addWordNote(word);
            });
        });
    }
    
    // 添加单词笔记
    addWordNote(word) {
        const existingNote = this.getWordNote(word);
        const note = prompt(`为单词 "${word}" 添加笔记：`, existingNote || '');
        if (note !== null) {
            let wordNotes = JSON.parse(localStorage.getItem('wordNotes') || '{}');
            if (note) {
                wordNotes[word] = note;
                localStorage.setItem('wordNotes', JSON.stringify(wordNotes));
                alert('笔记保存成功！');
            } else if (existingNote) {
                delete wordNotes[word];
                localStorage.setItem('wordNotes', JSON.stringify(wordNotes));
                alert('笔记已删除！');
            }
        }
    }
    
    // 获取单词笔记
    getWordNote(word) {
        const wordNotes = JSON.parse(localStorage.getItem('wordNotes') || '{}');
        return wordNotes[word] || '';
    }
    
    // 设置学习统计功能
    setupLearningStatistics() {
        const statsContainer = document.querySelector('.vocabulary-stats');
        if (statsContainer) {
            // 添加学习趋势统计
            this.updateLearningTrend();
        }
    }
    
    // 更新学习趋势
    updateLearningTrend() {
        // 获取最近7天的学习数据
        const learningData = this.getLearningData();
        const trendContainer = document.getElementById('memory-strength');
        if (trendContainer) {
            trendContainer.innerHTML = `
                <div class="learning-trend">
                    <h4>学习趋势</h4>
                    <div class="trend-chart">
                        ${learningData.map(day => `
                            <div class="trend-bar">
                                <div class="bar" style="height: ${day.count * 10}px;"></div>
                                <span class="day">${day.date}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    // 获取学习数据
    getLearningData() {
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = parseInt(localStorage.getItem(`learningCount_${dateStr}`) || '0');
            data.push({ date: dateStr.slice(-2), count });
        }
        return data;
    }
    
    // 设置单词分类功能
    setupWordCategories() {
        // 添加分类筛选按钮
        const tabs = document.querySelector('.vocabulary-tabs');
        if (tabs && !document.querySelector('.tab-btn[data-tab="word-categories"]')) {
            const categoryTab = document.createElement('button');
            categoryTab.className = 'tab-btn';
            categoryTab.setAttribute('data-tab', 'word-categories');
            categoryTab.textContent = '单词分类';
            tabs.appendChild(categoryTab);
        }
        
        // 添加分类内容
        const tabContent = document.querySelector('.tab-content:last-child');
        if (tabContent && !document.getElementById('word-categories')) {
            const categoryContent = document.createElement('div');
            categoryContent.className = 'tab-content';
            categoryContent.id = 'word-categories';
            categoryContent.innerHTML = `
                <div class="word-categories-content premium">
                    <div class="section-header">
                        <h3>单词分类</h3>
                        <p>按词性和难度分类浏览单词</p>
                    </div>
                    <div class="category-filters">
                        <button class="btn btn-secondary category-btn" data-category="all">全部</button>
                        <button class="btn btn-secondary category-btn" data-category="noun">名词</button>
                        <button class="btn btn-secondary category-btn" data-category="verb">动词</button>
                        <button class="btn btn-secondary category-btn" data-category="adjective">形容词</button>
                        <button class="btn btn-secondary category-btn" data-category="adverb">副词</button>
                    </div>
                    <div class="category-words" id="category-words">
                        <!-- 分类单词将在这里显示 -->
                    </div>
                </div>
            `;
            tabContent.parentNode.insertBefore(categoryContent, tabContent.nextSibling);
        }
        
        // 绑定分类按钮事件
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.showCategoryWords(category);
            });
        });
    }
    
    // 显示分类单词
    showCategoryWords(category) {
        const container = document.getElementById('category-words');
        if (container) {
            let filteredWords = this.words;
            if (category !== 'all') {
                filteredWords = this.words.filter(word => word.partOfSpeech === category);
            }
            
            container.innerHTML = `
                <div class="filtered-words-list">
                    ${filteredWords.slice(0, 20).map(word => `
                        <div class="word-card advanced">
                            <div class="word-card-header">
                                <div class="word-info">
                                    <h3 class="word">${word.word}</h3>
                                    <p class="phonetic">${word.phonetic}</p>
                                    <div class="pos-tag">
                                        <span class="pos-text">${word.partOfSpeech || 'noun'}</span>
                                    </div>
                                </div>
                                <button class="play-audio-btn" data-word="${word.word}">
                                    <i class="fas fa-volume-up"></i>
                                </button>
                            </div>
                            <div class="word-card-body">
                                <p class="meaning">${word.meaning}</p>
                                ${word.example ? `<div class="example"><small>${word.example}</small></div>` : ''}
                            </div>
                            <div class="word-card-footer">
                                <div class="word-actions">
                                    <button class="btn btn-primary add-to-learned" data-word="${word.word}">标记为已学</button>
                                    <button class="btn btn-secondary add-to-unknown" data-word="${word.word}">添加到生词本</button>
                                    <button class="btn btn-secondary note-btn" data-word="${word.word}"><i class="fas fa-sticky-note"></i> 笔记</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
            // 重新绑定事件
            this.bindAudioPlayButtons();
            this.setupWordNotes();
        }
    }
    
    // 设置复习提醒
    setupWordReviewReminders() {
        // 检查是否需要复习
        const wordsForReview = this.getWordsForReview();
        if (wordsForReview.length > 0) {
            const reminder = document.getElementById('review-reminder');
            if (reminder) {
                reminder.innerHTML = `
                    <div class="review-reminder advanced">
                        <i class="fas fa-bell"></i>
                        <span>有 ${wordsForReview.length} 个单词需要复习</span>
                        <button class="btn btn-sm btn-primary go-to-review">去复习</button>
                    </div>
                `;
                
                // 绑定去复习按钮
                document.querySelector('.go-to-review').addEventListener('click', () => {
                    const reviewTab = document.querySelector('.tab-btn[data-tab="review-section"]');
                    if (reviewTab) {
                        reviewTab.click();
                    }
                });
            }
        }
    }
    
    // 获取需要复习的单词
    getWordsForReview() {
        // 简化实现：返回前10个单词作为需要复习的单词
        return this.words.slice(0, 10);
    }
    
    // 初始化所有功能
    initAllFeatures() {
        this.enrichVocabularyFeatures();
        this.setupWordExplorer();
        this.setupExportImport();
        this.setupEasterEgg();
    }
    
    // 改进复习功能
    showReviewWords() {
        const reviewWords = this.getWordsForReview();
        const reviewContainer = document.getElementById('review-section-content');
        
        if (reviewContainer) {
            if (reviewWords.length === 0) {
                reviewContainer.innerHTML = '<p class="text-center">暂无需要复习的单词</p>';
                return;
            }
            
            reviewContainer.innerHTML = '';
            
            // 添加复习统计信息
            const statsDiv = document.createElement('div');
            statsDiv.className = 'review-stats';
            statsDiv.style.marginBottom = '30px';
            statsDiv.style.padding = '20px';
            statsDiv.style.backgroundColor = 'rgba(90, 115, 215, 0.05)';
            statsDiv.style.borderRadius = '12px';
            statsDiv.innerHTML = `
                <h4>复习统计</h4>
                <p>今日需要复习：<strong>${reviewWords.length}</strong> 个单词</p>
                <p>预计完成时间：<strong>${Math.round(reviewWords.length * 1.5)}</strong> 分钟</p>
            `;
            reviewContainer.appendChild(statsDiv);
            
            // 添加单词卡片
            reviewWords.forEach((word, index) => {
                const wordCard = document.createElement('div');
                wordCard.className = 'word-card';
                wordCard.style.marginBottom = '20px';
                wordCard.style.padding = '20px';
                wordCard.style.borderRadius = '12px';
                wordCard.style.backgroundColor = 'white';
                wordCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                wordCard.innerHTML = `
                    <h4>${word.word}</h4>
                    <p class="text-muted">${word.phonetic}</p>
                    <p>${word.meaning}</p>
                    ${word.example ? `<p class="text-muted italic">${word.example}</p>` : ''}
                    <div class="mt-3">
                        <button class="btn btn-sm btn-primary review-know" data-word="${word.word}">认识</button>
                        <button class="btn btn-sm btn-secondary review-unknown" data-word="${word.word}">不认识</button>
                        <button class="btn btn-sm btn-outline play-audio" data-word="${word.word}">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                `;
                reviewContainer.appendChild(wordCard);
            });
            
            this.bindReviewButtons();
            this.bindAudioPlayButtons();
        }
    }
    
    // 设置句乐部功能
    setupSentenceClub() {
        // 设置句乐部标签页切换
        this.setupSentenceClubTabs();
        
        // 设置智能造句功能
        this.setupSentenceMaker();
        
        // 设置作文生成器功能
        this.setupEssayGenerator();
    }
    
    // 设置句乐部标签页切换
    setupSentenceClubTabs() {
        const tabBtns = document.querySelectorAll('.sentence-club-tabs .tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 更新标签按钮状态
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新标签内容 - 确保完全分开显示
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.style.display = 'none';
                });
                
                const activePanel = document.getElementById(tabId);
                activePanel.classList.add('active');
                activePanel.style.display = 'block';
                
                // 添加切换动画
                activePanel.style.opacity = '0';
                activePanel.style.transform = 'translateY(20px)';
                activePanel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                setTimeout(() => {
                    activePanel.style.opacity = '1';
                    activePanel.style.transform = 'translateY(0)';
                }, 10);
            });
        });
    }
    
    // 设置智能造句功能
    setupSentenceMaker() {
        const generateBtn = document.getElementById('generate-sentence');
        const resetBtn = document.getElementById('reset-sentence-options');
        const sentenceWord = document.getElementById('sentence-word');
        const sentenceResult = document.getElementById('sentence-result');
        
        if (generateBtn && sentenceWord && sentenceResult) {
            generateBtn.addEventListener('click', () => {
                const word = sentenceWord.value.trim();
                if (!word) {
                    alert('请输入要造句的单词');
                    return;
                }
                
                // 获取造句选项
                const grammar = document.getElementById('sentence-grammar').value;
                const clause = document.getElementById('sentence-clause').value;
                const scene = document.getElementById('sentence-scene').value;
                const modal = document.getElementById('sentence-modal').value;
                const time = document.getElementById('sentence-time').value;
                const difficulty = document.getElementById('sentence-difficulty').value;
                
                // 显示加载状态
                sentenceResult.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>生成句子中...</p></div>';
                
                // 模拟AI造句（实际项目中可以调用真实的AI API）
                setTimeout(() => {
                    const sentences = this.generateSentences(word, grammar, clause, scene, modal, time, difficulty);
                    this.displayGeneratedSentences(sentenceResult, word, sentences);
                }, 1000);
            });
        }
        
        // 添加重置条件按钮事件
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // 重置所有选项
                document.getElementById('sentence-grammar').value = '';
                document.getElementById('sentence-clause').value = '';
                document.getElementById('sentence-scene').value = '';
                document.getElementById('sentence-modal').value = '';
                document.getElementById('sentence-time').value = '';
                document.getElementById('sentence-difficulty').value = '';
                
                // 清空单词输入框
                if (sentenceWord) {
                    sentenceWord.value = '';
                }
                
                // 清空结果区域
                if (sentenceResult) {
                    sentenceResult.innerHTML = '<p>输入单词并设置选项，点击上方按钮生成句子</p>';
                }
            });
        }
    }
    
    // 设置作文生成器功能
    setupEssayGenerator() {
        const generateBtn = document.getElementById('generate-essay');
        const resetBtn = document.getElementById('reset-essay-options');
        const essayTopic = document.getElementById('essay-topic');
        const essayResult = document.getElementById('essay-result');
        
        if (generateBtn && essayTopic && essayResult) {
            generateBtn.addEventListener('click', () => {
                const topic = essayTopic.value.trim();
                if (!topic) {
                    alert('请输入作文主题');
                    return;
                }
                
                // 获取作文选项
                const type = document.getElementById('essay-type').value;
                const length = document.getElementById('essay-length').value;
                const level = document.getElementById('essay-level').value;
                
                // 显示加载状态
                essayResult.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><p>生成作文中...</p></div>';
                
                // 模拟AI作文生成（实际项目中可以调用真实的AI API）
                setTimeout(() => {
                    const essay = this.generateEssay(topic, type, length, level);
                    this.displayGeneratedEssay(essayResult, topic, essay);
                }, 1500);
            });
        }
        
        // 添加重置条件按钮事件
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                // 重置所有选项
                document.getElementById('essay-type').value = 'narrative';
                document.getElementById('essay-length').value = 'short';
                document.getElementById('essay-level').value = 'intermediate';
                
                // 清空主题输入框
                if (essayTopic) {
                    essayTopic.value = '';
                }
                
                // 清空结果区域
                if (essayResult) {
                    essayResult.innerHTML = '<p>输入作文主题并设置选项，点击上方按钮生成作文</p>';
                }
            });
        }
    }
    
    // 生成句子（模拟成熟AI）
    generateSentences(word, grammar, clause, scene, modal, time, difficulty) {
        // 首先获取单词的词性和含义，以便生成更符合实际的句子
        const wordData = this.words.find(w => w.word.toLowerCase() === word.toLowerCase());
        const partOfSpeech = wordData ? wordData.partOfSpeech : 'unknown';
        const wordMeaning = wordData ? wordData.meaning : '';
        
        // 常见单词的特殊处理，确保生成的句子更符合单词的实际含义
        const getSpecialWordTemplates = (word, difficulty) => {
            const specialWords = {
                // 常见名词
                'apple': {
                    'easy': [
                        { sentence: `I eat an apple every day.`, translation: `我每天吃一个苹果。` },
                        { sentence: `She gave me a red apple.`, translation: `她给了我一个红苹果。` },
                        { sentence: `Apples are good for health.`, translation: `苹果对健康有益。` }
                    ],
                    'medium': [
                        { sentence: `The apple I bought yesterday was very sweet and juicy.`, translation: `我昨天买的苹果非常甜多汁。` },
                        { sentence: `My mother makes delicious apple pie every weekend.`, translation: `我妈妈每个周末都会做美味的苹果派。` },
                        { sentence: `Apples are one of the most popular fruits around the world.`, translation: `苹果是世界上最受欢迎的水果之一。` }
                    ],
                    'hard': [
                        { sentence: `The orchard was filled with ripe apples ready to be harvested.`, translation: `果园里满是成熟的苹果，等待收获。` },
                        { sentence: `Despite being a simple fruit, the apple has played a significant role in various cultures and traditions.`, translation: `尽管是一种简单的水果，苹果在各种文化和传统中发挥了重要作用。` },
                        { sentence: `The nutritional value of apples includes vitamins, fiber, and antioxidants that contribute to overall well-being.`, translation: `苹果的营养价值包括维生素、纤维和抗氧化剂，有助于整体健康。` }
                    ]
                },
                'book': {
                    'easy': [
                        { sentence: `I have a new book.`, translation: `我有一本新书。` },
                        { sentence: `She likes to read books.`, translation: `她喜欢读书。` },
                        { sentence: `The book is very interesting.`, translation: `这本书非常有趣。` }
                    ],
                    'medium': [
                        { sentence: `The book I'm reading now tells an amazing story about friendship.`, translation: `我现在读的书讲述了一个关于友谊的精彩故事。` },
                        { sentence: `My teacher recommended this book to help improve my English.`, translation: `我的老师推荐这本书来帮助我提高英语。` },
                        { sentence: `Books can open up new worlds and broaden our horizons.`, translation: `书籍可以打开新的世界，拓宽我们的视野。` }
                    ],
                    'hard': [
                        { sentence: `The author's vivid descriptions in the book transported me to a different time and place.`, translation: `作者在书中生动的描述把我带到了一个不同的时间和地点。` },
                        { sentence: `Reading books regularly has been shown to enhance cognitive abilities and improve vocabulary.`, translation: `定期读书已被证明可以增强认知能力并提高词汇量。` },
                        { sentence: `The book's underlying themes of resilience and hope resonated deeply with readers of all ages.`, translation: `这本书关于韧性和希望的潜在主题引起了各个年龄段读者的深刻共鸣。` }
                    ]
                },
                // 常见动词
                'run': {
                    'easy': [
                        { sentence: `I can run fast.`, translation: `我可以跑得很快。` },
                        { sentence: `She runs every morning.`, translation: `她每天早上跑步。` },
                        { sentence: `We like to run in the park.`, translation: `我们喜欢在公园里跑步。` }
                    ],
                    'medium': [
                        { sentence: `After months of training, he finally learned to run a marathon.`, translation: `经过几个月的训练，他终于学会了跑马拉松。` },
                        { sentence: `Running regularly helps improve cardiovascular health and boost energy levels.`, translation: `定期跑步有助于改善心血管健康并提高能量水平。` },
                        { sentence: `She had to run quickly to catch the bus before it left.`, translation: `她不得不快跑才能在公交车离开前赶上。` }
                    ],
                    'hard': [
                        { sentence: `Despite the challenging terrain, the athlete managed to run the race with determination and grace.`, translation: `尽管 terrain 具有挑战性，运动员还是以决心和优雅跑完了比赛。` },
                        { sentence: `Running has become not just a form of exercise for her, but a way to clear her mind and find inner peace.`, translation: `跑步对她来说不仅是一种锻炼方式，也是一种理清思绪、寻找内心平静的方式。` },
                        { sentence: `The ability to run long distances is a testament to the human body's remarkable endurance and adaptability.`, translation: `能够长距离跑步证明了人体非凡的耐力和适应性。` }
                    ]
                },
                'eat': {
                    'easy': [
                        { sentence: `I eat breakfast every morning.`, translation: `我每天早上吃早餐。` },
                        { sentence: `She likes to eat ice cream.`, translation: `她喜欢吃冰淇淋。` },
                        { sentence: `We eat dinner together as a family.`, translation: `我们一家人一起吃晚餐。` }
                    ],
                    'medium': [
                        { sentence: `Eating a balanced diet is essential for maintaining good health.`, translation: `均衡饮食对保持健康至关重要。` },
                        { sentence: `He learned to eat with chopsticks during his trip to China.`, translation: `他在中国旅行期间学会了用筷子吃饭。` },
                        { sentence: `They decided to eat at a fancy restaurant to celebrate their anniversary.`, translation: `他们决定在一家高档餐厅吃饭庆祝他们的周年纪念日。` }
                    ],
                    'hard': [
                        { sentence: `The cultural significance of what and how we eat varies greatly across different societies and traditions.`, translation: `我们吃什么和怎么吃的文化意义在不同的社会和传统中差异很大。` },
                        { sentence: `Mindful eating involves paying full attention to the sensory experience of eating, which can lead to healthier food choices and better digestion.`, translation: `正念饮食包括充分关注饮食的感官体验，这可以导致更健康的食物选择和更好的消化。` },
                        { sentence: `The act of sharing a meal together has been a fundamental human social activity for millennia, strengthening bonds between individuals and communities.`, translation: `一起分享 meals 的行为几千年来一直是人类基本的社交活动，加强了个人和社区之间的联系。` }
                    ]
                },
                // 常见形容词
                'happy': {
                    'easy': [
                        { sentence: `I am very happy today.`, translation: `我今天非常开心。` },
                        { sentence: `She has a happy family.`, translation: `她有一个幸福的家庭。` },
                        { sentence: `The children look happy.`, translation: `孩子们看起来很开心。` }
                    ],
                    'medium': [
                        { sentence: `Receiving good news made her feel incredibly happy and grateful.`, translation: `收到好消息让她感到无比开心和感激。` },
                        { sentence: `A happy person tends to have more positive relationships and better overall well-being.`, translation: `快乐的人往往拥有更积极的关系和更好的整体福祉。` },
                        { sentence: `The party was filled with happy laughter and joyful conversations.`, translation: `派对上充满了开心的笑声和愉快的交谈。` }
                    ],
                    'hard': [
                        { sentence: `True happiness comes from within and is not dependent on external circumstances or material possessions.`, translation: `真正的幸福来自内心，不依赖于外部环境或物质财富。` },
                        { sentence: `The study found that acts of kindness and generosity towards others can significantly increase one's own feelings of happiness.`, translation: `研究发现，对他人的善良和慷慨行为可以显著增加自己的幸福感。` },
                        { sentence: `Cultivating a positive mindset and practicing gratitude are key factors in maintaining long-term happiness and life satisfaction.`, translation: `培养积极的心态和实践感恩是维持长期幸福和生活满意度的关键因素。` }
                    ]
                },
                'beautiful': {
                    'easy': [
                        { sentence: `The flowers are very beautiful.`, translation: `这些花非常美丽。` },
                        { sentence: `She has a beautiful smile.`, translation: `她有一个美丽的微笑。` },
                        { sentence: `We visited a beautiful park.`, translation: `我们参观了一个美丽的公园。` }
                    ],
                    'medium': [
                        { sentence: `The sunset over the ocean was one of the most beautiful sights I've ever seen.`, translation: `海上的日落是我见过的最美丽的景象之一。` },
                        { sentence: `Her beautiful voice captivated everyone in the audience.`, translation: `她美丽的声音迷住了观众中的每个人。` },
                        { sentence: `The city is known for its beautiful architecture and rich cultural heritage.`, translation: `这座城市以其美丽的建筑和丰富的文化遗产而闻名。` }
                    ],
                    'hard': [
                        { sentence: `Beauty is subjective and can be found in the simplest of things, from a child's laughter to a dew-covered leaf at dawn.`, translation: `美是主观的，可以在最简单的事物中找到，从孩子的笑声到黎明时分沾满露珠的叶子。` },
                        { sentence: `The artist's painting captured the beautiful essence of the countryside, with its rolling hills and golden fields.`, translation: `艺术家的画作捕捉了乡村的美丽本质，包括起伏的山丘和金色的田野。` },
                        { sentence: `Inner beauty, characterized by kindness, compassion, and integrity, often shines brighter than external beauty.`, translation: `以善良、同情和正直为特征的内在美往往比外在美更闪耀。` }
                    ]
                },
                // 常见副词
                'quickly': {
                    'easy': [
                        { sentence: `He runs quickly.`, translation: `他跑得快。` },
                        { sentence: `She finished her homework quickly.`, translation: `她很快完成了作业。` },
                        { sentence: `We need to leave quickly.`, translation: `我们需要快速离开。` }
                    ],
                    'medium': [
                        { sentence: `Despite the heavy traffic, they managed to get to the airport quickly.`, translation: `尽管交通拥堵，他们还是设法快速到达了机场。` },
                        { sentence: `The company responded quickly to customer complaints, which improved their reputation.`, translation: `公司快速回应客户投诉，提高了他们的声誉。` },
                        { sentence: `Thinking quickly on his feet, he was able to solve the problem before it escalated.`, translation: `他迅速思考，能够在问题升级之前解决它。` }
                    ],
                    'hard': [
                        { sentence: `In today's fast-paced world, the ability to adapt quickly to changing circumstances is a valuable skill in both personal and professional settings.`, translation: `在当今快节奏的世界中，快速适应变化环境的能力在个人和职业环境中都是一项宝贵的技能。` },
                        { sentence: `The emergency response team arrived quickly and efficiently, providing immediate assistance to those in need.`, translation: `应急响应团队快速高效地到达，为需要帮助的人提供即时援助。` },
                        { sentence: `Technology has enabled us to communicate quickly across vast distances, transforming the way we interact with one another.`, translation: `技术使我们能够跨越 vast distances 快速交流，改变了我们彼此互动的方式。` }
                    ]
                },
                'carefully': {
                    'easy': [
                        { sentence: `She writes carefully.`, translation: `她仔细地写字。` },
                        { sentence: `He drives carefully.`, translation: `他小心地开车。` },
                        { sentence: `We need to think carefully.`, translation: `我们需要仔细思考。` }
                    ],
                    'medium': [
                        { sentence: `The scientist carefully analyzed the data before drawing any conclusions.`, translation: `科学家在得出任何结论之前仔细分析了数据。` },
                        { sentence: `She carefully wrapped the fragile vase to ensure it wouldn't break during shipping.`, translation: `她仔细包装了易碎的花瓶，确保它在运输过程中不会破裂。` },
                        { sentence: `Carefully planning your schedule can help reduce stress and increase productivity.`, translation: `仔细规划你的日程安排可以帮助减轻压力并提高生产力。` }
                    ],
                    'hard': [
                        { sentence: `The surgeon carefully performed the delicate operation, demonstrating years of training and expertise.`, translation: `外科医生仔细进行了精细的手术，展示了多年的训练和专业知识。` },
                        { sentence: `Effective decision-making often requires carefully weighing the pros and cons of each option before committing to a course of action.`, translation: `有效的决策通常需要在采取行动之前仔细权衡每个选项的利弊。` },
                        { sentence: `The historian carefully examined the ancient manuscript, paying close attention to every detail to uncover its true significance.`, translation: `历史学家仔细检查了古代手稿，密切关注每一个细节以揭示其真正的意义。` }
                    ]
                }
            };
            
            return specialWords[word.toLowerCase()] || null;
        };
        
        // 根据单词词性和难度生成更符合实际的句子
        const generateSentenceForWord = (word, pos, difficulty) => {
            // 检查是否有特殊单词模板
            const specialTemplates = getSpecialWordTemplates(word, difficulty);
            if (specialTemplates && specialTemplates[difficulty]) {
                return specialTemplates[difficulty];
            }
            
            // 名词句子模板
            if (pos === 'noun' || pos === 'unknown') {
                const nounSentences = {
                    'easy': [
                        { sentence: `The ${word} is very important.`, translation: `这个${word}非常重要。` },
                        { sentence: `I have a ${word} at home.`, translation: `我家里有一个${word}。` },
                        { sentence: `She gave me a ${word} as a gift.`, translation: `她给了我一个${word}作为礼物。` }
                    ],
                    'medium': [
                        { sentence: `The ${word} that I bought yesterday is of high quality.`, translation: `我昨天买的那个${word}质量很高。` },
                        { sentence: `Using a ${word} can greatly improve our efficiency.`, translation: `使用${word}可以大大提高我们的效率。` },
                        { sentence: `The importance of ${word} cannot be overstated in modern society.`, translation: `在现代社会中，${word}的重要性怎么强调都不为过。` }
                    ],
                    'hard': [
                        { sentence: `Despite the challenges, the development of ${word} has revolutionized the way we live and work.`, translation: `尽管面临挑战，${word}的发展已经彻底改变了我们的生活和工作方式。` },
                        { sentence: `The intricate design of the ${word} reflects the ingenuity of its creators.`, translation: `${word}的复杂设计反映了其创造者的聪明才智。` },
                        { sentence: `As technology advances, the functionality of ${word} continues to expand, opening up new possibilities for innovation.`, translation: `随着技术的进步，${word}的功能不断扩展，为创新开辟了新的可能性。` }
                    ],
                    'very-hard': [
                        { sentence: `While some critics argue that the overuse of ${word} may have unintended consequences, proponents maintain that its benefits far outweigh any potential drawbacks, pointing to its role in driving economic growth and improving quality of life.`, translation: `虽然一些批评者认为过度使用${word}可能会产生意想不到的后果，但支持者坚持认为它的好处远远超过任何潜在的缺点，并指出它在推动经济增长和改善生活质量方面的作用。` },
                        { sentence: `The evolution of ${word} from its primitive origins to its current sophisticated form represents a remarkable journey of human innovation and perseverance.`, translation: `${word}从原始起源到当前复杂形式的演变，代表了人类创新和毅力的非凡历程。` },
                        { sentence: `In an era defined by rapid technological change, the adaptability of ${word} has allowed it to remain relevant, continuously evolving to meet the ever-changing needs of society.`, translation: `在一个以快速技术变革为特征的时代，${word}的适应性使其保持相关性，不断发展以满足社会不断变化的需求。` }
                    ]
                };
                return nounSentences[difficulty] || nounSentences['medium'];
            }
            
            // 动词句子模板
            if (pos === 'verb') {
                const verbSentences = {
                    'easy': [
                        { sentence: `I can ${word} very well.`, translation: `我可以很好地${word}。` },
                        { sentence: `She likes to ${word} every day.`, translation: `她喜欢每天${word}。` },
                        { sentence: `We need to ${word} together.`, translation: `我们需要一起${word}。` }
                    ],
                    'medium': [
                        { sentence: `After practicing for weeks, I finally learned how to ${word} correctly.`, translation: `经过几周的练习，我终于学会了如何正确地${word}。` },
                        { sentence: `The ability to ${word} effectively is a valuable skill in today's world.`, translation: `有效${word}的能力在当今世界是一项宝贵的技能。` },
                        { sentence: `He promised to ${word} as soon as possible.`, translation: `他承诺尽快${word}。` }
                    ],
                    'hard': [
                        { sentence: `Despite facing numerous obstacles, she managed to ${word} with remarkable determination and skill.`, translation: `尽管面临众多障碍，她还是以非凡的决心和技巧成功地${word}了。` },
                        { sentence: `The key to success is not just to ${word}, but to ${word} with passion and purpose.`, translation: `成功的关键不仅仅是${word}，而是带着激情和目标去${word}。` },
                        { sentence: `To truly ${word}, one must understand the underlying principles and context in which the action takes place.`, translation: `要真正${word}，必须了解行动发生的基本原则和背景。` }
                    ],
                    'very-hard': [
                        { sentence: `While some people believe that to ${word} is simply a matter of talent, research suggests that it is primarily a result of deliberate practice, consistent effort, and a growth mindset.`, translation: `虽然有些人认为${word}只是天赋问题，但研究表明，它主要是刻意练习、持续努力和成长心态的结果。` },
                        { sentence: `The ability to ${word} in the face of adversity not only builds character but also demonstrates resilience, a quality highly valued in both personal and professional settings.`, translation: `在逆境中${word}的能力不仅能塑造性格，还能展示韧性，这是个人和职业环境中都高度重视的品质。` },
                        { sentence: `To ${word} effectively requires not just technical proficiency, but also emotional intelligence, adaptability, and the ability to collaborate with others towards a common goal.`, translation: `要有效${word}，不仅需要技术熟练，还需要情商、适应性和与他人合作实现共同目标的能力。` }
                    ]
                };
                return verbSentences[difficulty] || verbSentences['medium'];
            }
            
            // 形容词句子模板
            if (pos === 'adjective') {
                const adjSentences = {
                    'easy': [
                        { sentence: `The book is very ${word}.`, translation: `这本书非常${word}。` },
                        { sentence: `She has a ${word} personality.`, translation: `她有${word}的个性。` },
                        { sentence: `That was a ${word} experience.`, translation: `那是一次${word}的经历。` }
                    ],
                    'medium': [
                        { sentence: `The movie was so ${word} that I couldn't stop watching it.`, translation: `这部电影非常${word}，我看得停不下来。` },
                        { sentence: `His ${word} performance impressed everyone in the audience.`, translation: `他${word}的表演给观众留下了深刻印象。` },
                        { sentence: `The solution to the problem was surprisingly ${word}.`, translation: `这个问题的解决方案令人惊讶地${word}。` }
                    ],
                    'hard': [
                        { sentence: `The ${word} beauty of the sunset left us speechless, as hues of orange and pink painted the sky in a breathtaking display.`, translation: `日落${word}的美景让我们 speechless，橙色和粉色的色调在天空中绘出令人叹为观止的景象。` },
                        { sentence: `Her ${word} understanding of the subject matter allowed her to explain complex concepts in a way that everyone could comprehend.`, translation: `她对主题${word}的理解使她能够以一种每个人都能理解的方式解释复杂的概念。` },
                        { sentence: `The novel's ${word} portrayal of human emotion resonated deeply with readers, earning it critical acclaim and a dedicated following.`, translation: `小说对人类情感${word}的描绘引起了读者的深刻共鸣，为它赢得了评论界的赞誉和忠实的追随者。` }
                    ],
                    'very-hard': [
                        { sentence: `The ${word} complexity of the human brain continues to fascinate scientists, who are constantly discovering new aspects of its structure and function that challenge our understanding of consciousness and cognition.`, translation: `人类大脑${word}的复杂性继续吸引着科学家，他们不断发现其结构和功能的新方面，挑战我们对意识和认知的理解。` },
                        { sentence: `In an increasingly interconnected world, the ability to appreciate ${word} cultural differences has become essential for fostering mutual respect and global harmony.`, translation: `在一个日益相互关联的世界中，欣赏${word}文化差异的能力对于促进相互尊重和全球和谐变得至关重要。` },
                        { sentence: `The ${word} interplay between technology and society has transformed the way we live, work, and interact, creating both unprecedented opportunities and complex challenges that require thoughtful consideration.`, translation: `技术与社会之间${word}的相互作用已经改变了我们的生活、工作和互动方式，创造了前所未有的机会和需要深思熟虑的复杂挑战。` }
                    ]
                };
                return adjSentences[difficulty] || adjSentences['medium'];
            }
            
            // 副词句子模板
            if (pos === 'adverb') {
                const advSentences = {
                    'easy': [
                        { sentence: `He runs ${word}.`, translation: `他${word}跑步。` },
                        { sentence: `She speaks ${word}.`, translation: `她${word}说话。` },
                        { sentence: `They worked ${word}.`, translation: `他们${word}工作。` }
                    ],
                    'medium': [
                        { sentence: `Despite the challenge, she completed the task ${word}.`, translation: `尽管面临挑战，她还是${word}完成了任务。` },
                        { sentence: `He explained the concept ${word}, making it easy for everyone to understand.`, translation: `他${word}解释了这个概念，使每个人都能轻松理解。` },
                        { sentence: `The team worked ${word} to meet the deadline.`, translation: `团队${word}工作以满足截止日期。` }
                    ],
                    'hard': [
                        { sentence: `She approached the problem ${word}, considering all possible angles before proposing a solution.`, translation: `她${word}处理这个问题，在提出解决方案之前考虑了所有可能的角度。` },
                        { sentence: `The company has grown ${word} over the past decade, expanding into new markets and developing innovative products.`, translation: `该公司在过去十年中${word}发展，拓展到新市场并开发创新产品。` },
                        { sentence: `He adapted ${word} to the changing circumstances, demonstrating remarkable flexibility and resourcefulness.`, translation: `他${word}适应了变化的环境，展示了非凡的灵活性和应变能力。` }
                    ],
                    'very-hard': [
                        { sentence: `In today's fast-paced world, the ability to think ${word} and make informed decisions has become increasingly important for personal and professional success.`, translation: `在当今快节奏的世界中，${word}思考和做出明智决策的能力对个人和职业成功变得越来越重要。` },
                        { sentence: `The organization has evolved ${word} to address emerging challenges, incorporating feedback from stakeholders and staying ahead of industry trends.`, translation: `该组织${word}发展以应对新兴挑战，吸收利益相关者的反馈并走在行业趋势的前列。` },
                        { sentence: `She navigated the complex negotiation process ${word}, balancing assertiveness with diplomacy to achieve a mutually beneficial outcome.`, translation: `她${word}驾驭了复杂的谈判过程，在自信和外交之间取得平衡，以实现互利的结果。` }
                    ]
                };
                return advSentences[difficulty] || advSentences['medium'];
            }
            
            // 默认句子模板
            const defaultSentences = {
                'easy': [
                    { sentence: `I know about ${word}.`, translation: `我知道${word}。` },
                    { sentence: `${word} is important.`, translation: `${word}很重要。` },
                    { sentence: `We learned about ${word} today.`, translation: `我们今天学习了${word}。` }
                ],
                'medium': [
                    { sentence: `The concept of ${word} is widely discussed in academic circles.`, translation: `${word}的概念在学术界被广泛讨论。` },
                    { sentence: `Understanding ${word} requires careful study and practice.`, translation: `理解${word}需要仔细学习和实践。` },
                    { sentence: `The significance of ${word} becomes apparent in various contexts.`, translation: `${word}的意义在各种背景下变得明显。` }
                ],
                'hard': [
                    { sentence: `The study of ${word} has led to numerous breakthroughs in our understanding of the world.`, translation: `对${word}的研究导致了我们对世界理解的众多突破。` },
                    { sentence: `The evolution of ${word} reflects broader societal changes and technological advancements.`, translation: `${word}的演变反映了更广泛的社会变化和技术进步。` },
                    { sentence: `Exploring the nuances of ${word} can provide valuable insights into human behavior and cognition.`, translation: `探索${word}的细微差别可以为人类行为和认知提供有价值的见解。` }
                ],
                'very-hard': [
                    { sentence: `The interdisciplinary nature of ${word} has allowed it to bridge gaps between different fields of study, fostering collaboration and innovation across traditional boundaries.`, translation: `${word}的跨学科性质使其能够弥合不同研究领域之间的差距，促进跨越传统边界的合作和创新。` },
                    { sentence: `As we continue to grapple with complex global challenges, the principles underlying ${word} offer valuable frameworks for addressing issues ranging from climate change to social inequality.`, translation: `当我们继续应对复杂的全球挑战时，${word}背后的原则为解决从气候变化到社会不平等的问题提供了有价值的框架。` },
                    { sentence: `The future of ${word} is likely to be shaped by emerging technologies and shifting societal priorities, requiring ongoing adaptation and critical engagement from scholars and practitioners alike.`, translation: `${word}的未来可能会受到新兴技术和不断变化的社会优先事项的影响，需要学者和实践者 alike 的持续适应和批判性参与。` }
                ]
            };
            return defaultSentences[difficulty] || defaultSentences['medium'];
        };
        
        // 根据难度选择句子
        let selectedDifficulty = 'medium';
        if (difficulty) {
            selectedDifficulty = difficulty;
        }
        
        // 获取适合单词的句子模板
        const templates = generateSentenceForWord(word, partOfSpeech, selectedDifficulty);
        
        // 生成3个不同的句子
        const sentencesWithTranslations = [];
        for (let i = 0; i < 3; i++) {
            let item = { ...templates[i % templates.length] };
            
            // 根据语法要求修改句子
            if (grammar) {
                item.sentence = this.adjustGrammar(item.sentence, grammar);
            }
            
            // 根据时态修改句子
            if (time) {
                item.sentence = this.adjustTense(item.sentence, time);
            }
            
            // 添加情态动词
            if (modal) {
                item.sentence = this.addModalVerb(item.sentence, modal);
            }
            
            // 根据场景修改句子
            if (scene) {
                item.sentence = this.adjustScene(item.sentence, scene);
            }
            
            // 添加从句
            if (clause) {
                item.sentence = this.addClause(item.sentence, clause);
            }
            
            sentencesWithTranslations.push(item);
        }
        
        return sentencesWithTranslations;
    }
    
    // 根据语法要求调整句子
    adjustGrammar(sentence, grammar) {
        switch (grammar) {
            case 'simple':
                return `I ${sentence.toLowerCase().replace('I ', '')}`;
            case 'compound':
                return `${sentence} and I feel proud of it.`;
            case 'complex':
                return `Although it was difficult, ${sentence.toLowerCase()}`;
            case 'compound-complex':
                return `Although it was difficult, ${sentence.toLowerCase()} and I feel proud of what I accomplished.`;
            default:
                return sentence;
        }
    }
    
    // 根据时态调整句子
    adjustTense(sentence, time) {
        switch (time) {
            case 'past':
                return sentence.replace('like', 'liked').replace('has', 'had').replace('are', 'were').replace('can', 'could').replace('need', 'needed');
            case 'future':
                return sentence.replace('I like', 'I will like').replace('She has', 'She will have').replace('They are', 'They will be').replace('He can', 'He will be able to').replace('We need', 'We will need');
            case 'present-perfect':
                return sentence.replace('I like', 'I have liked').replace('She has', 'She has had').replace('They are', 'They have been').replace('He can', 'He has been able to').replace('We need', 'We have needed');
            case 'past-perfect':
                return sentence.replace('I like', 'I had liked').replace('She has', 'She had had').replace('They are', 'They had been').replace('He can', 'He had been able to').replace('We need', 'We had needed');
            case 'present-continuous':
                return sentence.replace('I like', 'I am liking').replace('She has', 'She is having').replace('They are', 'They are being').replace('He can', 'He is able to').replace('We need', 'We are needing');
            default:
                return sentence;
        }
    }
    
    // 添加情态动词
    addModalVerb(sentence, modal) {
        switch (modal) {
            case 'can':
                return sentence.replace('I like', 'I can like').replace('She has', 'She can have').replace('They are', 'They can be').replace('He can', 'He can').replace('We need', 'We can need');
            case 'could':
                return sentence.replace('I like', 'I could like').replace('She has', 'She could have').replace('They are', 'They could be').replace('He can', 'He could').replace('We need', 'We could need');
            case 'may':
                return sentence.replace('I like', 'I may like').replace('She has', 'She may have').replace('They are', 'They may be').replace('He can', 'He may be able to').replace('We need', 'We may need');
            case 'might':
                return sentence.replace('I like', 'I might like').replace('She has', 'She might have').replace('They are', 'They might be').replace('He can', 'He might be able to').replace('We need', 'We might need');
            case 'must':
                return sentence.replace('I like', 'I must like').replace('She has', 'She must have').replace('They are', 'They must be').replace('He can', 'He must be able to').replace('We need', 'We must need');
            case 'should':
                return sentence.replace('I like', 'I should like').replace('She has', 'She should have').replace('They are', 'They should be').replace('He can', 'He should be able to').replace('We need', 'We should need');
            case 'would':
                return sentence.replace('I like', 'I would like').replace('She has', 'She would have').replace('They are', 'They would be').replace('He can', 'He would be able to').replace('We need', 'We would need');
            default:
                return sentence;
        }
    }
    
    // 根据场景调整句子
    adjustScene(sentence, scene) {
        switch (scene) {
            case 'daily':
                return `In my daily life, ${sentence.toLowerCase()}`;
            case 'academic':
                return `In an academic setting, ${sentence.toLowerCase()}`;
            case 'business':
                return `In a business context, ${sentence.toLowerCase()}`;
            case 'social':
                return `In social situations, ${sentence.toLowerCase()}`;
            case 'travel':
                return `While traveling, ${sentence.toLowerCase()}`;
            default:
                return sentence;
        }
    }
    
    // 添加从句
    addClause(sentence, clause) {
        switch (clause) {
            case 'adjective':
                return `${sentence} that is important to me`;
            case 'adverbial':
                return `${sentence} when I have free time`;
            case 'noun':
                return `What I want is ${sentence.toLowerCase()}`;
            default:
                return sentence;
        }
    }
    
    // 显示生成的句子
    displayGeneratedSentences(container, word, sentencesWithTranslations) {
        container.innerHTML = `
            <h4>为单词 "${word}" 生成的句子</h4>
            <div class="sentences-list">
                ${sentencesWithTranslations.map((item, index) => `
                    <div class="sentence-item">
                        <div class="sentence-content">
                            <p class="english-sentence">${index + 1}. ${item.sentence}</p>
                            <p class="chinese-translation">${item.translation}</p>
                        </div>
                        <button class="btn btn-sm btn-outline play-audio" data-word="${item.sentence}">
                            <i class="fas fa-volume-up"></i> 朗读
                        </button>
                    </div>
                `).join('')}
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .sentences-list {
                margin-top: 20px;
            }
            .sentence-item {
                margin-bottom: 15px;
                padding: 20px;
                background-color: rgba(90, 115, 215, 0.05);
                border-radius: 12px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                transition: all 0.3s ease;
            }
            .sentence-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .sentence-content {
                flex: 1;
                margin-right: 15px;
            }
            .english-sentence {
                margin: 0 0 8px 0;
                font-size: 16px;
                font-weight: 500;
                color: #333;
            }
            .chinese-translation {
                margin: 0;
                font-size: 14px;
                color: #666;
                line-height: 1.4;
            }
            .sentence-club-tabs {
                display: flex;
                margin-bottom: 30px;
                border-bottom: 2px solid rgba(90, 115, 215, 0.1);
            }
            .sentence-club-tabs .tab-btn {
                padding: 12px 24px;
                border: none;
                background: none;
                cursor: pointer;
                font-size: 16px;
                font-weight: 500;
                color: #666;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                margin-right: 20px;
            }
            .sentence-club-tabs .tab-btn.active {
                color: #4361ee;
                border-bottom-color: #4361ee;
            }
            .sentence-club-tabs .tab-btn:hover {
                color: #4361ee;
            }
            .tab-panel {
                display: none;
            }
            .tab-panel.active {
                display: block;
            }
            .essay-generator {
                margin-bottom: 30px;
            }
            .sentence-actions {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
        
        // 绑定音频播放按钮
        this.bindAudioPlayButtons();
    }
    
    // 生成作文（模拟AI）
    generateEssay(topic, type, length, level) {
        // 模拟不同类型和长度的作文
        const essays = {
            narrative: {
                short: {
                    beginner: {
                        content: `Last weekend, I went to the park with my family. We had a picnic there. The weather was sunny and warm. We ate sandwiches and fruits. We also played frisbee. I had a lot of fun. It was a happy day.`,
                        translation: `上周末，我和家人一起去了公园。我们在那里野餐。天气晴朗温暖。我们吃了三明治和水果。我们还玩了飞盘。我玩得很开心。那是快乐的一天。`
                    },
                    intermediate: {
                        content: `Last summer vacation, my family and I went to the beach. The journey took us about two hours by car. When we arrived, the sun was shining brightly and the sea was blue. We built sandcastles and swam in the sea. In the evening, we watched the sunset. It was one of the most beautiful sunsets I have ever seen. We stayed there for three days and had a wonderful time.`,
                        translation: `去年暑假，我和家人去了海滩。我们开车花了大约两个小时的路程。当我们到达时，阳光明媚，大海蔚蓝。我们建了沙堡，在海里游泳。晚上，我们看了日落。那是我见过的最美丽的日落之一。我们在那里待了三天，度过了美好的时光。`
                    },
                    advanced: {
                        content: `It was a crisp autumn morning when I decided to take a walk in the old town. The streets were lined with ancient buildings, their walls covered in ivy. As I walked, I passed a small café where the aroma of freshly baked bread wafted through the air. I stopped to watch an elderly man feeding pigeons in the square. His hands moved slowly, and he spoke to the birds in a soft voice. It was a peaceful scene that made me forget about the hustle and bustle of city life. That afternoon, I sat by the river, watching the leaves fall gently into the water. It was a day filled with simple pleasures that I will always remember.`,
                        translation: `那是一个清爽的秋日早晨，我决定在老城区散步。街道两旁是古老的建筑，墙壁上爬满了常春藤。走着走着，我经过一家小咖啡馆，新鲜出炉的面包香气弥漫在空气中。我停下来观看一位老人在广场上喂鸽子。他的手动作缓慢，用柔和的声音和鸟儿说话。那是一幅宁静的景象，让我忘记了城市生活的喧嚣。那天下午，我坐在河边，看着树叶轻轻落入水中。那是充满简单快乐的一天，我将永远铭记。`
                    }
                },
                medium: {
                    beginner: {
                        content: `My best friend is Lily. We have been friends since kindergarten. She is kind and helpful. We often play together after school. We like to read books and draw pictures. Last year, she moved to a new house, but we still keep in touch. We talk on the phone every weekend. I hope we will be friends forever.`,
                        translation: `我最好的朋友是莉莉。我们从幼儿园就是朋友。她善良又乐于助人。我们经常放学后一起玩。我们喜欢读书和画画。去年，她搬到了新房子，但我们仍然保持联系。我们每个周末都通电话。我希望我们永远是朋友。`
                    },
                    intermediate: {
                        content: `My best friend Tom and I have shared countless memories over the past six years. We first met in middle school when we were assigned to the same class. What brought us together was our mutual love for basketball. Every afternoon after school, we would head to the playground to practice. We also helped each other with our homework, especially in math, which was challenging for both of us. Last year, Tom won the school basketball championship, and I was his biggest cheerleader. When I had a difficult time with my studies, Tom was always there to encourage me. True friendship, I believe, is about supporting each other through both good times and bad.`,
                        translation: `在过去的六年里，我和最好的朋友汤姆分享了无数的回忆。我们第一次见面是在中学，当时我们被分到同一个班级。让我们走到一起的是我们对篮球的共同热爱。每天下午放学后，我们都会去操场练习。我们也互相帮助做作业，尤其是在对我们俩都很有挑战性的数学方面。去年，汤姆赢得了学校篮球冠军，我是他最大的啦啦队长。当我在学习上遇到困难时，汤姆总是在那里鼓励我。我相信，真正的友谊是关于在顺境和逆境中相互支持。`
                    },
                    advanced: {
                        content: `The bond between my grandmother and me is one of the most precious relationships in my life. She raised me when my parents were busy with their careers. Every morning, she would wake me up with a warm smile and a bowl of homemade congee. In the afternoons, we would sit in her garden, where she taught me about various plants and told me stories from her childhood. One winter, I fell seriously ill, and she stayed by my bedside day and night, comforting me with her gentle voice. As I grew older, our conversations evolved from fairy tales to discussions about life and its challenges. Even now, when I face difficulties, I think of her wise words: "Patience and kindness will carry you through any storm." Her love has shaped who I am today, and I am forever grateful for her presence in my life.`,
                        translation: `我和祖母之间的纽带是我生命中最珍贵的关系之一。在我父母忙于事业时，她抚养了我。每天早上，她会带着温暖的微笑和一碗自制的粥叫醒我。下午，我们会坐在她的花园里，她教我认识各种植物，给我讲她童年的故事。一个冬天，我得了重病，她日夜守在我床边，用她温柔的声音安慰我。随着我长大，我们的对话从童话故事演变为关于生活及其挑战的讨论。即使现在，当我面临困难时，我会想起她的至理名言："耐心和善良会带你度过任何风暴。"她的爱塑造了今天的我，我永远感激她在我生命中的存在。`
                    }
                },
                long: {
                    beginner: {
                        content: `I love my school very much. It is a big and beautiful school. There are many trees and flowers in the school yard. My teachers are kind and knowledgeable. They teach us many useful things. My classmates are friendly. We often play and study together. There are many interesting classes, such as English, math, and art. I especially like English class because it is fun. After school, there are many clubs to join. I join the chess club. I have a lot of fun at school every day.`,
                        translation: `我非常爱我的学校。它是一所又大又美丽的学校。校园里有许多树和花。我的老师善良又知识渊博。他们教我们许多有用的东西。我的同学很友好。我们经常一起玩和学习。有许多有趣的课程，如英语、数学和美术。我特别喜欢英语课，因为它很有趣。放学后，有许多俱乐部可以加入。我加入了象棋俱乐部。我每天在学校都很开心。`
                    },
                    intermediate: {
                        content: `My school is not just a place of learning; it is a second home where I have grown both academically and personally. Located in the heart of the city, it has a spacious campus with lush green lawns and modern facilities. The classrooms are bright and well-equipped with the latest technology. What makes my school truly special, however, are the people. My teachers are not only experts in their subjects but also caring mentors who go above and beyond to help their students. They encourage us to think critically and express our ideas freely. My classmates come from diverse backgrounds, and we have formed a close-knit community where everyone feels valued. The school offers a wide range of extracurricular activities, from sports teams to debate clubs, allowing students to explore their interests and develop new skills. Last year, I participated in the school play, which was a transformative experience that helped me build confidence. I am grateful for the opportunities my school provides and the memories I have made here. It has prepared me well for the future and instilled in me a love for lifelong learning.`,
                        translation: `我的学校不仅仅是一个学习的地方；它是我的第二个家，我在这里在学术和个人方面都得到了成长。它位于城市中心，有一个宽敞的校园，有茂密的绿色草坪和现代化的设施。教室明亮，配备了最新的技术设备。然而，让我的学校真正特别的是这里的人。我的老师不仅是各自学科的专家，也是关心学生的导师，他们不遗余力地帮助学生。他们鼓励我们批判性地思考，自由地表达我们的想法。我的同学来自不同的背景，我们形成了一个紧密的社区，每个人都感到被重视。学校提供广泛的课外活动，从运动队到辩论俱乐部，让学生能够探索他们的兴趣并发展新技能。去年，我参加了学校的戏剧表演，这是一次改变我人生的经历，帮助我建立了自信。我感谢学校提供的机会和我在这里留下的回忆。它为我的未来做好了充分准备，并向我灌输了对终身学习的热爱。`
                    },
                    advanced: {
                        content: `My high school experience has been a journey of self-discovery and growth that has shaped my perspective on life. Nestled in a quiet neighborhood, the school's red-brick buildings and sprawling oak trees create an atmosphere of both tradition and vitality. From the moment I stepped through its gates as a freshman, I was struck by the sense of community that permeated every corner. The curriculum is rigorous, designed to challenge students while fostering a love for learning. My favorite class, AP Literature, exposed me to diverse literary works that expanded my understanding of different cultures and human experiences. Outside the classroom, I threw myself into various activities, eventually becoming captain of the robotics team. Leading the team taught me valuable lessons in collaboration, problem-solving, and resilience when faced with setbacks. The teachers, with their passion and dedication, have been instrumental in my development. One in particular, Mr. Johnson, encouraged me to pursue my interest in engineering by introducing me to research opportunities and mentoring me through my first science fair project. The friendships I have formed here are deep and meaningful, rooted in shared experiences and mutual support. As I prepare to graduate, I look back with gratitude at the countless ways my school has prepared me for the challenges and opportunities that lie ahead. It has not only equipped me with academic knowledge but also instilled in me the values of integrity, empathy, and the importance of contributing to the greater good. My school has truly been a catalyst for my personal and intellectual growth, and I will carry the lessons I have learned here throughout my life.`,
                        translation: `我的高中经历是一段自我发现和成长的旅程，它塑造了我对生活的看法。学校坐落在一个安静的社区，红砖建筑和蔓延的橡树营造出一种既有传统又有活力的氛围。当我作为新生第一次走进校门时，我被弥漫在每个角落的社区感所震撼。课程严格，旨在挑战学生的同时培养对学习的热爱。我最喜欢的课程，AP文学，让我接触到多样化的文学作品，扩展了我对不同文化和人类经验的理解。在课堂之外，我投身于各种活动，最终成为机器人团队的队长。领导团队教会了我宝贵的协作、解决问题和面对挫折时的韧性课程。老师们以他们的热情和奉献精神，对我的发展起到了重要作用。特别是约翰逊先生，他通过向我介绍研究机会并指导我完成第一个科学展览会项目，鼓励我追求对工程学的兴趣。我在这里建立的友谊深厚而有意义，植根于共同的经历和相互支持。当我准备毕业时，我怀着感激之情回顾学校为我准备未来挑战和机遇的无数方式。它不仅为我提供了学术知识，还向我灌输了正直、同理心和为更大利益做贡献的重要性等价值观。我的学校真正成为了我个人和智力成长的催化剂，我将终身铭记在这里学到的教训。`
                    }
                }
            },
            argumentative: {
                short: {
                    beginner: {
                        content: `I think homework is important for students. First, it helps us review what we learned in class. Second, it teaches us to work independently. Third, it prepares us for tests. Some students say homework is too much, but I think it is necessary. We should do our homework carefully every day.`,
                        translation: `我认为家庭作业对学生很重要。首先，它帮助我们复习课堂上学到的内容。其次，它教我们独立工作。第三，它为我们的考试做准备。一些学生说家庭作业太多，但我认为它是必要的。我们应该每天认真做作业。`
                    },
                    intermediate: {
                        content: `The debate over whether homework is beneficial for students has been ongoing for years. While some argue that it causes unnecessary stress, I believe homework plays a crucial role in the learning process. Firstly, homework reinforces the concepts taught in class, allowing students to practice and solidify their understanding. Secondly, it teaches valuable skills such as time management, self-discipline, and independent problem-solving. These skills are essential for success in both academic and professional settings. Thirdly, homework prepares students for upcoming lessons and assessments, ensuring they are well-equipped to participate in classroom discussions. While it is true that excessive homework can be counterproductive, a reasonable amount tailored to students' needs can significantly enhance their educational experience. Therefore, homework should be seen not as a burden but as an integral part of a well-rounded education.`,
                        translation: `关于家庭作业是否对学生有益的争论已经持续了多年。虽然一些人认为它造成了不必要的压力，但我相信家庭作业在学习过程中起着至关重要的作用。首先，家庭作业强化了课堂上教授的概念，让学生能够练习并巩固他们的理解。其次，它教授宝贵的技能，如时间管理、自律和独立解决问题的能力。这些技能对学术和职业环境中的成功至关重要。第三，家庭作业为学生准备即将到来的课程和评估，确保他们有充分的准备参与课堂讨论。虽然过多的家庭作业确实可能适得其反，但根据学生需求定制的合理数量可以显著增强他们的教育体验。因此，家庭作业不应被视为负担，而应被视为全面教育的一个组成部分。`
                    },
                    advanced: {
                        content: `In today's fast-paced educational environment, the role of homework has become a subject of intense debate. Critics argue that it encroaches on students' free time, leading to burnout and reduced interest in learning. However, when designed thoughtfully, homework serves as a powerful tool for academic success and personal development. One of the primary benefits of homework is that it extends learning beyond the classroom, allowing students to engage with material at their own pace. This personalized approach enables them to focus on areas where they need additional practice, fostering a deeper understanding of the subject matter. Furthermore, homework cultivates essential life skills such as responsibility, perseverance, and time management. By completing assignments independently, students learn to set goals, prioritize tasks, and overcome challenges—skills that are invaluable in adulthood. Additionally, homework provides an opportunity for parents to be involved in their children's education, creating a stronger home-school connection. While it is crucial to avoid overloading students with excessive work, eliminating homework entirely would deprive them of these significant benefits. Educators must strike a balance, assigning meaningful, purposeful homework that complements classroom instruction rather than merely occupying time. When implemented effectively, homework not only enhances academic achievement but also prepares students for the demands of college, career, and life beyond school.`,
                        translation: `在当今快节奏的教育环境中，家庭作业的作用已成为激烈辩论的主题。批评者认为它侵占了学生的空闲时间，导致 burnout 和对学习兴趣的降低。然而，当设计周到时，家庭作业是学术成功和个人发展的有力工具。家庭作业的主要好处之一是它将学习延伸到课堂之外，让学生能够按照自己的节奏参与材料。这种个性化的方法使他们能够专注于需要额外练习的领域，促进对主题的更深入理解。此外，家庭作业培养了责任、毅力和时间管理等基本生活技能。通过独立完成作业，学生学习设定目标、优先处理任务和克服挑战——这些技能在成年后非常宝贵。此外，家庭作业为父母参与孩子的教育提供了机会，创造了更强的家校联系。虽然避免给学生布置过多的作业至关重要，但完全取消家庭作业会剥夺他们这些重要的好处。教育者必须取得平衡，分配有意义、有目的的家庭作业，以补充课堂教学，而不仅仅是占用时间。当有效实施时，家庭作业不仅能提高学术成就，还能为学生准备大学、职业和学校以外生活的需求。`
                    }
                },
                medium: {
                    beginner: {
                        content: `I think we should protect the environment. First, the environment is important for our health. Second, it is home to many animals and plants. Third, we need to leave a good environment for future generations. We can do many things to protect the environment, such as planting trees, saving water, and reducing waste. Let's work together to make the world a better place.`,
                        translation: `我认为我们应该保护环境。首先，环境对我们的健康很重要。其次，它是许多动植物的家园。第三，我们需要为后代留下一个良好的环境。我们可以做很多事情来保护环境，比如植树、节约用水和减少浪费。让我们一起努力让世界变得更美好。`
                    },
                    intermediate: {
                        content: `Protecting the environment is one of the most pressing issues facing humanity today. The consequences of environmental degradation, such as climate change, air pollution, and loss of biodiversity, are already being felt around the world. It is our responsibility to take action now to preserve the planet for future generations. There are several effective ways individuals can contribute to environmental protection. First, reducing our carbon footprint by using public transportation, cycling, or walking instead of driving can significantly decrease greenhouse gas emissions. Second, conserving resources such as water and electricity helps reduce the strain on natural systems. Simple actions like turning off lights when not in use or fixing leaky faucets can make a big difference. Third, adopting a more sustainable lifestyle by reducing waste, recycling, and supporting eco-friendly products encourages businesses to prioritize environmental responsibility. While government policies and corporate actions are crucial, individual efforts collectively have a powerful impact. By making conscious choices in our daily lives, we can all play a part in protecting the environment. The future of our planet depends on the actions we take today, and every small step towards sustainability counts.`,
                        translation: `保护环境是当今人类面临的最紧迫问题之一。环境退化的后果，如气候变化、空气污染和生物多样性丧失，已经在世界各地感受到。我们有责任现在就采取行动，为后代保护地球。个人可以通过几种有效方式为环境保护做出贡献。首先，通过使用公共交通、骑自行车或步行而不是开车来减少碳足迹，可以显著减少温室气体排放。其次，节约水和电等资源有助于减轻对自然系统的压力。像不用时关灯或修理漏水的水龙头这样的简单行动可以产生很大的影响。第三，通过减少浪费、回收利用和支持环保产品来采用更可持续的生活方式，鼓励企业优先考虑环境责任。虽然政府政策和企业行动至关重要，但个人努力集体产生强大的影响。通过在日常生活中做出有意识的选择，我们都可以在保护环境方面发挥作用。地球的未来取决于我们今天采取的行动，每一个迈向可持续发展的小步骤都很重要。`
                    },
                    advanced: {
                        content: `The urgency of environmental protection has never been more apparent than it is today. With climate change accelerating, species going extinct at an unprecedented rate, and natural resources being depleted, the need for immediate action is clear. While systemic change requires government intervention and corporate responsibility, individuals hold significant power to drive transformation through their choices and behaviors. One of the most impactful ways to protect the environment is by adopting a plant-rich diet. Livestock agriculture is a major contributor to greenhouse gas emissions, deforestation, and water pollution. By reducing meat consumption and choosing plant-based alternatives, individuals can drastically lower their environmental footprint. Another effective strategy is to embrace a circular economy mindset by reducing waste, reusing items whenever possible, and recycling properly. This not only conserves resources but also reduces the amount of waste sent to landfills and incinerators. Additionally, supporting renewable energy by installing solar panels or choosing green energy providers helps accelerate the transition away from fossil fuels. Education and advocacy are also crucial; by raising awareness about environmental issues and supporting policies that protect the planet, individuals can create a groundswell of support for systemic change. It is important to recognize that environmental protection is not just an obligation but an opportunity to create healthier, more sustainable communities. By making environmentally conscious choices in our daily lives, we not only protect the planet but also improve our own well-being and that of future generations. The time for action is now, and every individual has a role to play in shaping a more sustainable future.`,
                        translation: `环境保护的紧迫性从未像今天这样明显。随着气候变化加速，物种以前所未有的速度灭绝，自然资源被耗尽，立即采取行动的必要性显而易见。虽然系统性变革需要政府干预和企业责任，但个人通过他们的选择和行为拥有推动变革的重大力量。保护环境最有效的方法之一是采用富含植物的饮食。畜牧业是温室气体排放、森林砍伐和水污染的主要贡献者。通过减少肉类消费并选择植物性替代品，个人可以大幅降低环境足迹。另一个有效的策略是通过减少浪费、尽可能重复使用物品和正确回收来拥抱循环经济思维。这不仅节约资源，还减少了送往垃圾填埋场和焚化炉的废物量。此外，通过安装太阳能电池板或选择绿色能源供应商来支持可再生能源，有助于加速从化石燃料的过渡。教育和倡导也至关重要；通过提高对环境问题的认识并支持保护地球的政策，个人可以为系统性变革创造广泛的支持。重要的是要认识到，环境保护不仅是一种义务，也是创造更健康、更可持续社区的机会。通过在日常生活中做出环保选择，我们不仅保护地球，还改善了我们自己和后代的福祉。行动的时间就是现在，每个人都可以在塑造更可持续的未来方面发挥作用。`
                    }
                },
                long: {
                    beginner: {
                        content: `I think technology is good for students. First, it helps us learn better. We can use computers to search for information. Second, it makes communication easier. We can talk to friends and family far away. Third, it provides entertainment. We can watch movies and play games. Some people say technology is bad, but I think it is good if we use it properly. We should use technology wisely.`,
                        translation: `我认为技术对学生有好处。首先，它帮助我们更好地学习。我们可以使用电脑搜索信息。其次，它使交流更容易。我们可以与远方的朋友和家人交谈。第三，它提供娱乐。我们可以看电影和玩游戏。一些人说技术不好，但我认为如果我们正确使用它，它是好的。我们应该明智地使用技术。`
                    },
                    intermediate: {
                        content: `The integration of technology in education has revolutionized the way students learn and teachers instruct. While some critics argue that it distracts students and reduces face-to-face interaction, the benefits of educational technology far outweigh the drawbacks. One of the most significant advantages is that it makes learning more engaging and interactive. Interactive whiteboards, educational apps, and virtual reality simulations bring abstract concepts to life, making difficult subjects more accessible and enjoyable for students. Technology also promotes personalized learning, allowing students to learn at their own pace. Adaptive learning platforms can identify individual strengths and weaknesses, providing tailored content that meets each student's unique needs. Furthermore, technology expands access to education beyond the classroom walls. Students can access a wealth of resources online, from educational videos to virtual field trips, enriching their learning experience. It also facilitates collaboration and communication, enabling students to work together on projects regardless of their physical location. Teachers benefit from technology as well, as it allows them to streamline administrative tasks, provide immediate feedback, and track student progress more effectively. While it is important to teach students responsible technology use and maintain a balance between digital and traditional learning methods, the integration of technology in education has undeniably enhanced the learning process, preparing students for the digital age in which they will live and work.`,
                        translation: `技术在教育中的整合彻底改变了学生学习和教师教学的方式。虽然一些批评者认为它分散了学生的注意力并减少了面对面的互动，但教育技术的好处远远超过了缺点。最显著的优势之一是它使学习更具吸引力和互动性。交互式白板、教育应用程序和虚拟现实模拟将抽象概念变为现实，使困难的科目对学生来说更容易理解和享受。技术还促进个性化学习，让学生按照自己的节奏学习。自适应学习平台可以识别个人的优势和劣势，提供满足每个学生独特需求的定制内容。此外，技术扩展了课堂之外的教育机会。学生可以在线访问丰富的资源，从教育视频到虚拟实地考察，丰富他们的学习体验。它还促进协作和交流，使学生能够在项目上合作，无论他们的物理位置如何。教师也从技术中受益，因为它允许他们简化行政任务，提供即时反馈，并更有效地跟踪学生进度。虽然重要的是要教导学生负责任地使用技术，并在数字和传统学习方法之间保持平衡，但技术在教育中的整合无疑增强了学习过程，为学生准备了他们将生活和工作的数字时代。`
                    },
                    advanced: {
                        content: `The impact of technology on education has been transformative, reshaping not only how knowledge is delivered but also how students engage with learning. While concerns about screen time, digital distractions, and the potential erosion of social skills are valid, the strategic integration of technology offers unprecedented opportunities to enhance educational outcomes. One of the most profound benefits is the democratization of education. Technology breaks down geographical barriers, allowing students in remote or underserved areas to access high-quality educational resources and connect with experts from around the world. Online courses, virtual classrooms, and educational platforms provide flexible learning opportunities that cater to diverse learning styles and needs, making education more inclusive. Furthermore, technology enables data-driven instruction, allowing educators to analyze student performance in real time and adjust their teaching strategies accordingly. Adaptive learning systems can identify knowledge gaps and provide targeted interventions, ensuring that no student falls through the cracks. Technology also fosters creativity and critical thinking by providing tools for students to create, collaborate, and problem-solve. From coding platforms that teach computational thinking to digital storytelling tools that encourage self-expression, technology empowers students to become active creators rather than passive consumers of information. Additionally, technology prepares students for the demands of the 21st-century workforce, where digital literacy and technological proficiency are essential skills. By integrating technology into education, we are not just teaching students content; we are equipping them with the tools they need to thrive in an increasingly digital world. While it is crucial to address the challenges associated with educational technology, such as ensuring equitable access and promoting responsible use, the potential benefits for student learning and development are immense. As technology continues to evolve, so too will its role in education, offering new and innovative ways to inspire and educate future generations.`,
                        translation: `技术对教育的影响是变革性的，不仅重塑了知识的传递方式，也重塑了学生参与学习的方式。虽然对屏幕时间、数字干扰和社交技能潜在侵蚀的担忧是合理的，但技术的战略性整合提供了前所未有的机会来增强教育成果。最深远的好处之一是教育的民主化。技术打破了地理障碍，让偏远或服务不足地区的学生能够访问高质量的教育资源并与来自世界各地的专家联系。在线课程、虚拟教室和教育平台提供了灵活的学习机会，满足多样化的学习风格和需求，使教育更具包容性。此外，技术实现了数据驱动的教学，让教育者能够实时分析学生表现并相应调整教学策略。自适应学习系统可以识别知识差距并提供有针对性的干预，确保没有学生被遗漏。技术还通过为学生提供创造、协作和解决问题的工具来培养创造力和批判性思维。从教授计算思维的编码平台到鼓励自我表达的数字 storytelling工具，技术使学生成为积极的创造者，而不是信息的被动消费者。此外，技术为学生准备了21世纪劳动力的需求，其中数字素养和技术熟练程度是基本技能。通过将技术整合到教育中，我们不仅教授学生内容；我们还为他们提供在日益数字化的世界中茁壮成长所需的工具。虽然解决与教育技术相关的挑战至关重要，例如确保公平获取和促进负责任使用，但对学生学习和发展的潜在好处是巨大的。随着技术不断发展，它在教育中的作用也将不断发展，为启发和教育未来几代人提供新的创新方式。`
                    }
                }
            },
            expository: {
                short: {
                    beginner: {
                        content: `How to make a paper plane. First, take a piece of paper. Second, fold it in half. Third, fold the top corners down to the center. Fourth, fold the new corners down again. Fifth, fold the plane in half. Finally, fold the wings down. Now you have a paper plane. You can fly it.`,
                        translation: `如何制作纸飞机。首先，拿一张纸。其次，把它对折。第三，把顶角向下折到中心。第四，再次把新的角向下折。第五，把飞机对折。最后，把翅膀向下折。现在你有了一架纸飞机。你可以飞它。`
                    },
                    intermediate: {
                        content: `Making a paper airplane is a simple and fun activity that anyone can enjoy. To start, you will need a single sheet of 8.5 x 11 inch paper. First, fold the paper in half lengthwise to create a crease, then unfold it. Next, take the top left and right corners and fold them down to meet at the center crease, forming a triangle at the top. After that, fold the newly formed top corners down again to meet at the center crease, creating a smaller triangle. Then, fold the entire paper in half along the original center crease, making sure all the edges align. Finally, fold down each wing along the bottom edge of the airplane, leaving about an inch of space from the bottom of the fuselage. To ensure your paper airplane flies well, make sure all folds are crisp and symmetrical. You can adjust the angle of the wings to make it fly farther or perform tricks. With a little practice, you can create a paper airplane that soars through the air with ease.`,
                        translation: `制作纸飞机是一项简单而有趣的活动，任何人都可以享受。首先，你需要一张8.5 x 11英寸的纸。首先，将纸纵向对折以创建折痕，然后展开它。接下来，把左上角和右上角向下折到中心折痕处，在顶部形成一个三角形。之后，再次将新形成的顶角向下折到中心折痕处，创建一个更小的三角形。然后，沿着原始中心折痕将整个纸对折，确保所有边缘对齐。最后，沿着飞机的底部边缘向下折每个机翼，离机身底部留下约一英寸的空间。为了确保你的纸飞机飞得好，确保所有折痕都清晰对称。你可以调整机翼的角度，使它飞得更远或表演技巧。通过一点练习，你可以创建一架轻松翱翔在空中的纸飞机。`
                    },
                    advanced: {
                        content: `The art of making a high-performance paper airplane involves understanding basic aerodynamic principles and executing precise folds. To create a paper airplane that flies long distances, start with a standard 8.5 x 11 inch sheet of paper. Begin by folding the paper in half lengthwise to create a center crease, then unfold it. Next, take the top left and right corners and fold them down to meet at the center crease, forming a sharp triangle at the top. This creates the nose of the airplane and helps with directional stability. After that, fold the newly formed top edges down again to meet at the center crease, creating a more streamlined shape. This second fold reduces drag and improves aerodynamics. Then, fold the entire paper in half along the original center crease, ensuring all edges are perfectly aligned. This symmetry is crucial for balanced flight. Finally, fold down each wing, making sure they are identical in size and angle. The wings should be folded at a slight upward angle, known as dihedral angle, which provides lateral stability. To optimize performance, adjust the wingtips slightly upward to create washout, which helps prevent stalling. The center of gravity should be slightly forward of the center of the airplane, which can be achieved by adding a small paper clip to the nose if needed. Experiment with different wing shapes and sizes to find the configuration that works best for your flying style and environment. With patience and attention to detail, you can create a paper airplane that rivals commercially made gliders in performance.`,
                        translation: `制作高性能纸飞机的艺术涉及理解基本的空气动力学原理和执行精确的折叠。要创建一架飞得很远的纸飞机，从一张标准的8.5 x 11英寸纸开始。首先，将纸纵向对折以创建中心折痕，然后展开它。接下来，把左上角和右上角向下折到中心折痕处，在顶部形成一个尖锐的三角形。这创建了飞机的机头，有助于方向稳定性。之后，再次将新形成的顶部边缘向下折到中心折痕处，创建更流线型的形状。这第二次折叠减少了阻力并改善了空气动力学。然后，沿着原始中心折痕将整个纸对折，确保所有边缘完全对齐。这种对称性对平衡飞行至关重要。最后，向下折每个机翼，确保它们的大小和角度相同。机翼应该以略微向上的角度折叠，称为二面角，这提供了横向稳定性。为了优化性能，略微向上调整翼尖以创建洗出，这有助于防止失速。重心应该稍微位于飞机中心的前方，如果需要，可以通过在机头添加一个小回形针来实现。尝试不同的机翼形状和大小，找到最适合你的飞行风格和环境的配置。通过耐心和对细节的关注，你可以创建一架在性能上与商业制造的滑翔机相媲美的纸飞机。`
                    }
                },
                medium: {
                    beginner: {
                        content: `My favorite season is spring. Spring comes after winter. The weather gets warmer. The flowers bloom. The trees turn green. Birds sing. People can go outside more. I like to fly kites in spring. I also like to have picnics with my family. Spring is a happy season.`,
                        translation: `我最喜欢的季节是春天。春天在冬天之后到来。天气变暖。花儿绽放。树变绿。鸟儿歌唱。人们可以更多地外出。我喜欢在春天放风筝。我也喜欢和家人一起野餐。春天是一个快乐的季节。`
                    },
                    intermediate: {
                        content: `Spring, often referred to as the season of renewal, is a time of transformation and growth in nature. After the cold, dormant winter months, spring brings warmer temperatures, longer days, and a burst of life. One of the most noticeable signs of spring is the blooming of flowers. Cherry blossoms, daffodils, and tulips paint the landscape with vibrant colors, creating a feast for the eyes. Trees that were bare during winter begin to sprout new leaves, turning the once-gray world green again. Animals also respond to the changing season. Birds return from their winter migrations, filling the air with their songs as they build nests and prepare for breeding. Squirrels become more active, foraging for food and chasing each other through the trees. Humans also embrace spring with renewed energy. People spend more time outdoors, engaging in activities like hiking, gardening, and picnicking. The longer daylight hours and milder weather lift spirits and encourage social interaction. Farmers prepare their fields for planting, and students look forward to the end of the school year. Spring is not just a season; it is a symbol of hope and new beginnings. It reminds us that after every period of darkness, there is light, and after every challenge, there is growth. This universal theme of renewal is why spring holds a special place in the hearts of people around the world.`,
                        translation: `春天，通常被称为更新的季节，是自然界转变和成长的时期。在寒冷、休眠的冬季之后，春天带来了更温暖的温度、更长的白天和生命的爆发。春天最明显的迹象之一是花朵的绽放。樱花、水仙花和郁金香用鲜艳的颜色点缀风景，创造了一场视觉盛宴。冬天光秃秃的树开始发芽新叶，将曾经灰色的世界再次变绿。动物也对季节变化做出反应。鸟儿从冬季迁徙中返回，在筑巢和准备繁殖时用它们的歌声填满空气。松鼠变得更加活跃，寻找食物并在树间追逐。人类也以更新的能量拥抱春天。人们花更多时间在户外，从事徒步旅行、园艺和野餐等活动。更长的日照时间和更温和的天气提升了情绪并鼓励社交互动。农民准备田地种植，学生期待学年结束。春天不仅仅是一个季节；它是希望和新开始的象征。它提醒我们，在每一段黑暗之后，都有光明，在每一个挑战之后，都有成长。这种普遍的更新主题是为什么春天在世界各地人们的心中占有特殊地位。`
                    },
                    advanced: {
                        content: `Spring is a season of profound transformation, marking the transition from the dormancy of winter to the vitality of summer. This metamorphosis is not merely a change in temperature but a complex interplay of environmental factors that trigger a cascade of biological events. As the Earth's axis tilts toward the sun, days grow longer, and solar radiation increases, warming the soil and air. This temperature shift is the primary cue for plants to break their winter dormancy. Trees begin to produce cytokinins, hormones that stimulate bud growth, while decreasing their production of abscisic acid, the hormone responsible for maintaining dormancy. The result is the emergence of delicate leaf buds and vibrant blossoms, each species responding to specific temperature thresholds. For example, cherry blossoms require a period of cold followed by a specific number of warm days to bloom, creating the spectacular spring displays in temperate regions. Animals also undergo significant changes during spring. Many species, such as bears and groundhogs, emerge from hibernation, their metabolic rates returning to normal as food becomes more abundant. Birds undertake remarkable migrations, some traveling thousands of miles to reach their breeding grounds. The increase in insect activity provides a crucial food source for these migrating birds and their soon-to-be-hatched chicks. Humans, too, are affected by the changing season. The increase in daylight triggers the brain to reduce production of melatonin, the hormone that regulates sleep, leading to increased energy and mood improvement—a phenomenon often referred to as the "spring fever." Culturally, spring has been celebrated for millennia, with festivals like Easter, Nowruz, and Cherry Blossom Festivals marking the renewal of life. From a biological perspective, spring is a testament to nature's resilience and adaptability, a reminder that even after the harshest of winters, life finds a way to thrive.`,
                        translation: `春天是一个深刻转变的季节，标志着从冬季的休眠到夏季的活力的过渡。这种蜕变不仅仅是温度的变化，而是环境因素的复杂相互作用，触发了一系列生物事件。当地球自转轴向太阳倾斜时，白天变长，太阳辐射增加，温暖了土壤和空气。这种温度变化是植物打破冬季休眠的主要线索。树木开始产生细胞分裂素，这种激素刺激芽的生长，同时减少脱落酸的产生，脱落酸是维持休眠的激素。结果是 delicate leaf buds 和 vibrant blossoms 的出现，每个物种对特定的温度阈值做出反应。例如，樱花需要一段时间的寒冷，然后是特定数量的温暖日子才能开花，在温带地区创造了壮观的春季展示。动物在春天也经历了显著的变化。许多物种，如熊和土拨鼠，从冬眠中苏醒，它们的代谢率随着食物变得更加丰富而恢复正常。鸟儿进行着惊人的迁徙，有些旅行数千英里到达它们的繁殖地。昆虫活动的增加为这些迁徙的鸟儿和它们即将孵化的雏鸟提供了至关重要的食物来源。人类也受到季节变化的影响。日照时间的增加触发大脑减少褪黑素的产生，褪黑素是调节睡眠的激素，导致能量增加和情绪改善——这种现象通常被称为"春热"。在文化上，春天已经庆祝了数千年，复活节、诺鲁孜节和樱花节等节日标志着生命的更新。从生物学的角度来看，春天是大自然韧性和适应性的证明，提醒我们即使在最严酷的冬天之后，生命也能找到繁荣的方式。`
                    }
                },
                long: {
                    beginner: {
                        content: `I like to read books. Reading is fun. I read many different types of books. I read storybooks, science books, and history books. Storybooks take me to different worlds. Science books teach me about the world around me. History books tell me about the past. I usually read before bed. Sometimes I read during the day. Reading makes me smart. It also makes me happy. I love reading.`,
                        translation: `我喜欢读书。读书很有趣。我读许多不同类型的书。我读故事书、科学书和历史书。故事书带我去不同的世界。科学书教我关于周围的世界。历史书告诉我关于过去的事情。我通常在睡前读书。有时我在白天读书。读书使我聪明。它也使我快乐。我爱读书。`
                    },
                    intermediate: {
                        content: `Reading is a fundamental skill that opens doors to knowledge, imagination, and personal growth. The benefits of reading extend far beyond acquiring information; it enriches our lives in numerous ways. First and foremost, reading expands our vocabulary and improves our language skills. Exposure to a variety of texts exposes us to new words and sentence structures, enhancing our ability to communicate effectively. Reading also boosts cognitive function by stimulating the brain and improving memory and concentration. When we read, we must follow plotlines, remember characters, and make connections between ideas, all of which exercise our mental faculties. Furthermore, reading broadens our perspectives by introducing us to different cultures, experiences, and viewpoints. Through books, we can travel to distant lands, live in different time periods, and understand the thoughts and feelings of people very different from ourselves. This exposure fosters empathy and tolerance, helping us become more understanding and compassionate individuals. Reading also sparks creativity and imagination. Unlike television or movies, which provide visual images, books require us to create mental pictures of characters, settings, and events, encouraging our minds to think creatively. Additionally, reading is a form of stress relief. Getting lost in a good book can transport us from our worries and provide a much-needed escape from the pressures of daily life. Whether we prefer fiction, non-fiction, poetry, or biographies, reading has the power to educate, entertain, and inspire. It is a lifelong activity that can be enjoyed at any age, and its benefits accumulate over time, making it one of the most valuable habits we can cultivate.`,
                        translation: `阅读是一项基本技能，为知识、想象力和个人成长打开大门。阅读的好处远远超出了获取信息；它以多种方式丰富我们的生活。首先，阅读扩大我们的词汇量并提高我们的语言技能。接触各种文本使我们接触到新单词和句子结构，增强我们有效沟通的能力。阅读还通过刺激大脑并改善记忆和注意力来促进认知功能。当我们阅读时，我们必须遵循情节线，记住角色，并在想法之间建立联系，所有这些都锻炼我们的心智能力。此外，阅读通过向我们介绍不同的文化、经历和观点来拓宽我们的视角。通过书籍，我们可以前往遥远的土地，生活在不同的时期，理解与我们非常不同的人的思想和感受。这种接触培养同理心和宽容，帮助我们成为更理解和富有同情心的人。阅读还激发创造力和想象力。与提供视觉图像的电视或电影不同，书籍要求我们创建角色、设置和事件的心理图像，鼓励我们的思想创造性地思考。此外，阅读是一种减压方式。沉浸在一本好书中可以将我们从担忧中转移出来，为我们提供急需的逃避日常生活压力的机会。无论我们喜欢小说、非小说、诗歌还是传记，阅读都有教育、娱乐和启发的力量。它是一项可以在任何年龄享受的终身活动，其好处随着时间的推移而累积，使其成为我们可以培养的最有价值的习惯之一。`
                    },
                    advanced: {
                        content: `Reading is a multifaceted activity that profoundly impacts our intellectual, emotional, and social development. At its core, reading is a cognitive process that involves decoding symbols to derive meaning, but its effects extend far beyond basic comprehension. One of the most significant benefits of reading is its ability to enhance critical thinking skills. Engaging with complex texts requires us to analyze arguments, evaluate evidence, and form our own opinions, fostering a more discerning and analytical mind. Reading also promotes emotional intelligence by allowing us to experience the world through others' perspectives. When we read about characters facing challenges, making decisions, and experiencing a range of emotions, we develop a deeper understanding of human behavior and empathy for others. This emotional resonance helps us navigate our own relationships and interactions more effectively. Furthermore, reading serves as a repository of collective knowledge, preserving the wisdom, stories, and experiences of past generations. Through historical texts, classic literature, and scholarly works, we connect with the intellectual heritage of humanity, gaining insights that would otherwise be lost to time. Reading also stimulates neuroplasticity, the brain's ability to form new neural connections, which helps maintain cognitive function as we age. Studies have shown that regular reading can delay the onset of cognitive decline and reduce the risk of Alzheimer's disease. Additionally, reading is a gateway to lifelong learning. It equips us with the skills to pursue knowledge independently, adapt to new information, and stay intellectually curious throughout our lives. In an age of constant distraction and information overload, reading provides a focused, immersive experience that allows us to engage deeply with ideas and explore complex topics at our own pace. Whether we read for pleasure, education, or professional development, the act of reading enriches our lives in ways that few other activities can match. It is not merely a skill but a lifelong companion that continues to grow with us, offering new insights and perspectives with each book we open.`,
                        translation: `阅读是一种多方面的活动，对我们的智力、情感和社会发展产生深远影响。从本质上讲，阅读是一个认知过程，涉及解码符号以获取意义，但其影响远远超出了基本理解。阅读最重要的好处之一是它能够提高批判性思维技能。参与复杂的文本要求我们分析论点、评估证据并形成自己的观点，培养更具洞察力和分析能力的思维。阅读还通过让我们通过他人的视角体验世界来促进情商。当我们阅读关于角色面临挑战、做出决定和经历一系列情绪的内容时，我们对人类行为和对他人的同理心有了更深入的理解。这种情感共鸣帮助我们更有效地驾驭自己的关系和互动。此外，阅读是集体知识的宝库，保存了过去几代人的智慧、故事和经历。通过历史文本、经典文学和学术著作，我们与人类的知识遗产相连，获得否则会随着时间流逝而丢失的见解。阅读还刺激神经可塑性，即大脑形成新神经连接的能力，这有助于在我们变老时维持认知功能。研究表明，定期阅读可以延迟认知能力下降的开始并降低阿尔茨海默病的风险。此外，阅读是终身学习的门户。它使我们具备独立追求知识、适应新信息并在一生中保持智力好奇心的技能。在一个不断分心和信息过载的时代，阅读提供了一种专注、沉浸式的体验，让我们能够深入参与想法并按照自己的节奏探索复杂的主题。无论我们是为了娱乐、教育还是专业发展而阅读，阅读行为以很少有其他活动能匹配的方式丰富我们的生活。它不仅仅是一种技能，而是一个终身伴侣，随着我们的成长而成长，每打开一本书都能提供新的见解和视角。`
                    }
                }
            },
            descriptive: {
                short: {
                    beginner: {
                        content: `My bedroom is my favorite place. It is small but cozy. There is a bed, a desk, and a bookshelf. My bed is soft and comfortable. My desk is where I do my homework. My bookshelf is full of books. I like to read in my bedroom. I feel safe and happy there.`,
                        translation: `我的卧室是我最喜欢的地方。它很小但很舒适。有一张床、一张桌子和一个书架。我的床柔软舒适。我的桌子是我做作业的地方。我的书架装满了书。我喜欢在卧室里读书。我在那里感到安全和快乐。`
                    },
                    intermediate: {
                        content: `My bedroom is a sanctuary of comfort and personal expression, reflecting my personality and providing a space where I can relax and be myself. The walls are painted a soft shade of blue, reminiscent of a clear summer sky, which creates a calm and peaceful atmosphere. A large window on the east wall allows sunlight to flood the room in the morning, waking me gently with its warm glow. Below the window stands my wooden desk, cluttered with textbooks, notebooks, and a small lamp that casts a warm light in the evenings. Next to the desk is my bed, covered with a cozy comforter printed with constellations, a reminder of my fascination with astronomy. Above the bed, a string of fairy lights twinkles softly, adding a magical touch to the room. A bookshelf against the opposite wall is overflowing with books of various genres, from fantasy novels to science textbooks, each one a portal to a different world. The carpet on the floor is a plush, neutral color that feels soft under my feet when I wake up in the morning. Scattered around the room are small personal touches: a poster of my favorite band, a collection of seashells from family vacations, and a plant on the windowsill that adds a touch of greenery. This room is more than just a place to sleep; it is my personal retreat, where I can study, read, daydream, and recharge. It is a space that is uniquely mine, and I cherish every moment spent within its walls.`,
                        translation: `我的卧室是一个舒适和个人表达的 sanctuary，反映了我的个性，提供了一个我可以放松和做自己的空间。墙壁被漆成柔和的蓝色，让人想起晴朗的夏日天空，创造了一种平静和宁静的氛围。东墙上的一扇大窗户让早晨的阳光充满房间，用温暖的光芒轻轻唤醒我。窗户下面是我的 wooden desk，摆满了教科书、笔记本和一盏小灯，晚上投射出温暖的光线。桌子旁边是我的床，覆盖着印有星座的舒适被子，提醒我对天文学的迷恋。床上方，一串 fairy lights 柔和地闪烁，为房间增添了一丝魔力。对面墙上的书架上摆满了各种类型的书籍，从奇幻小说到科学教科书，每一本都是通往不同世界的门户。地板上的地毯是毛绒的中性颜色，早上醒来时感觉柔软。房间里散落着一些个人小物件：我最喜欢的乐队的海报、家庭度假时收集的贝壳，以及窗台上的一盆植物，增添了一丝绿色。这个房间不仅仅是一个睡觉的地方；它是我的个人 retreat，我可以在那里学习、阅读、白日做梦和充电。这是一个独特属于我的空间，我珍惜在它的墙壁内度过的每一刻。`
                    },
                    advanced: {
                        content: `Nestled at the top of the stairs, my bedroom is a haven of tranquility and self-expression, a space that has evolved with me over the years. The walls, once painted a vibrant pink in my childhood, now boast a serene sage green that evokes the calm of a forest at dawn. The room is bathed in natural light from a bay window that overlooks the backyard, where a towering oak tree stands sentinel, its branches swaying gently in the breeze. Below the window, my desk is a testament to my academic pursuits and creative endeavors: a laptop sits open to a research paper, a half-finished watercolor painting leans against the wall, and a jar of pencils in various stages of use sits beside a stack of unread books. My bed, positioned in the center of the room, is dressed in crisp white linens with a hand-stitched quilt that was a gift from my grandmother, its intricate patterns telling stories of her youth. Above the bed, a gallery wall showcases a collection of my most treasured possessions: a pressed flower from my first date, a ticket stub from my favorite concert, and a drawing my little sister made for me. To the right of the bed, a vintage armchair upholstered in a floral pattern provides the perfect spot for reading, its cushions worn soft from years of use. A floor lamp with a linen shade casts a warm, golden glow in the evenings, creating an ambiance that invites relaxation. The room smells faintly of lavender, from the sachets tucked in my dresser drawers, and the air carries the distant sound of birds singing outside. This bedroom is more than just a physical space; it is a reflection of who I am—my interests, my memories, and my dreams. It is where I retreat after a long day, where I celebrate my successes, and where I find solace during difficult times. Every object, every color, every texture has meaning, making this room uniquely mine and irreplaceable.`,
                        translation: `我的卧室坐落在楼梯顶部，是一个宁静和自我表达的 haven，一个多年来随着我一起进化的空间。墙壁，在我童年时曾经漆成鲜艳的粉红色，现在呈现出一种宁静的鼠尾草绿色，唤起黎明时分森林的平静。房间沐浴在从俯瞰后院的凸窗透进来的自然光中，那里有一棵高大的橡树站岗，树枝在微风中轻轻摇曳。窗户下面，我的桌子证明了我的学术追求和创造性努力：一台笔记本电脑打开到一篇研究论文，一幅未完成的水彩画靠在墙上，一罐处于不同使用阶段的铅笔坐在一堆未读的书旁边。我的床，位于房间中央，铺着 crisp white linens，上面有一条我祖母送的手工缝制的被子，其复杂的图案讲述着她年轻时的故事。床上方，一面画廊墙展示了我最珍贵的财产：第一次约会时的压花，最喜欢的音乐会的票根，以及我妹妹为我画的画。床的右边，一把带有花卉图案的复古扶手椅提供了完美的阅读 spot，其靠垫因多年使用而变得柔软。一盏带有亚麻灯罩的落地灯在晚上投射出温暖的金色光芒，创造了一种邀请放松的氛围。房间里有淡淡的薰衣草味，来自塞在梳妆台抽屉里的香囊，空气中带着外面鸟儿歌唱的遥远声音。这个卧室不仅仅是一个物理空间；它反映了我是谁——我的兴趣、我的记忆和我的梦想。它是我在漫长的一天后 retreat 的地方，是我庆祝成功的地方，也是我在困难时期寻找安慰的地方。每一个物体，每一种颜色，每一种纹理都有意义，使这个房间独特地属于我且不可替代。`
                    }
                },
                medium: {
                    beginner: {
                        content: `My favorite park is beautiful. There are many trees and flowers. There is a lake in the middle. People can boat on the lake. There are benches where people can sit. There is a playground for children. I like to walk in the park. I also like to feed the ducks in the lake. The park is a nice place to relax.`,
                        translation: `我最喜欢的公园很漂亮。有许多树和花。中间有一个湖。人们可以在湖上划船。有长椅供人们坐。有一个儿童游乐场。我喜欢在公园里散步。我也喜欢在湖里喂鸭子。公园是一个放松的好地方。`
                    },
                    intermediate: {
                        content: `Central Park, located in the heart of New York City, is a breathtaking oasis of nature amid the urban jungle. Spanning 843 acres, this iconic park offers a diverse range of landscapes and activities that cater to people of all ages and interests. As you enter through one of its grand gates, you are immediately greeted by lush green lawns that stretch as far as the eye can see, dotted with people picnicking, playing frisbee, or simply enjoying the sunshine. To the left, a winding path leads through a dense forest of oak and maple trees, their branches forming a leafy canopy that filters the sunlight and creates a cool, shaded retreat from the summer heat. Following the path further, you come across the Jacqueline Kennedy Onassis Reservoir, a large body of water where joggers run along the perimeter and visitors stop to admire the stunning views of the Manhattan skyline reflected in its calm surface. Nearby, the Central Park Zoo houses a variety of animals, from playful sea lions to majestic snow leopards, delighting visitors with its diverse collection. For children, the park offers numerous playgrounds, including the famous Heckscher Playground, which features swings, slides, and climbing structures. In the southern part of the park, the Bethesda Terrace and Fountain provide a grand gathering place, with its ornate stone carvings and the iconic Angel of the Waters statue. As the day draws to a close, the park takes on a magical quality, with the setting sun casting a golden glow over the landscape and the sounds of street musicians filling the air. Whether you're seeking solitude, recreation, or cultural experiences, Central Park offers something for everyone, making it not just a park but a vital part of New York City's identity and a beloved destination for locals and tourists alike.`,
                        translation: `中央公园位于纽约市中心，是城市丛林中令人惊叹的自然绿洲。这个标志性公园占地843英亩，提供多样化的景观和活动，满足各个年龄段和兴趣的人们。当你通过它的一扇大门进入时，你会立即看到一望无际的郁郁葱葱的草坪，点缀着野餐、玩飞盘或只是享受阳光的人们。左边，一条蜿蜒的小路穿过茂密的橡树和枫树森林，它们的树枝形成了一个叶冠，过滤阳光，为夏季炎热创造了一个凉爽、阴凉的 retreat。沿着小路 further，你会遇到杰奎琳·肯尼迪·奥纳西斯水库，这是一个大型水体，慢跑者沿着周边跑步，游客停下来欣赏曼哈顿天际线在其平静表面的倒影。附近，中央公园动物园饲养着各种动物，从顽皮的海狮到雄伟的雪豹，以其多样化的收藏取悦游客。对于儿童，公园提供了许多游乐场，包括著名的赫克舍游乐场，它有秋千、滑梯和攀爬结构。在公园的南部，贝塞斯达露台和喷泉提供了一个盛大的聚会场所，其华丽的石雕和标志性的 Waters 天使雕像。当一天接近尾声时，公园呈现出一种神奇的品质，落日在景观上投射出金色的光芒，街头音乐家的声音弥漫在空气中。无论你是寻求孤独、娱乐还是文化体验，中央公园都为每个人提供了一些东西，使其不仅是一个公园，也是纽约市身份的重要组成部分，是当地人和游客的 beloved destination。`
                    },
                    advanced: {
                        content: `Stanley Park, a 1,001-acre urban park in Vancouver, British Columbia, is a masterpiece of natural beauty that seamlessly blends pristine wilderness with carefully designed recreational spaces. As you enter the park through its grand entrance, you are immediately struck by the sight of the North Shore Mountains towering in the distance, their snow-capped peaks providing a dramatic backdrop to the lush greenery below. The park's most famous feature, the Seawall, is a 9-kilometer paved path that winds along the park's perimeter, offering breathtaking views of the Pacific Ocean, English Bay, and the distant Gulf Islands. Along the Seawall, joggers, cyclists, and rollerbladers share the path with walkers who stop to admire the resident sea lions lounging on the rocks or watch kayakers gliding across the water. Inland, the park is crisscrossed by a network of trails that lead through ancient rainforests, where towering Douglas firs and western red cedars, some over 500 years old, create a cathedral-like atmosphere with their massive trunks and dense canopies. Sunlight filters through the leaves in dappled patterns, illuminating the moss-covered ground and creating a sense of tranquility that feels worlds away from the bustling city just beyond the park's borders. The park is also home to a variety of wildlife, including squirrels, raccoons, and over 200 species of birds, making it a paradise for nature lovers. For families, the park offers the Vancouver Aquarium, which showcases marine life from the Pacific Northwest, and the Stanley Park Railway, a miniature train that takes visitors on a scenic tour through the park. The Lost Lagoon, a freshwater lake near the park's entrance, is a popular spot for birdwatching, with its boardwalk providing close-up views of ducks, swans, and herons. In the summer, the park comes alive with outdoor concerts, theater performances, and festivals, while winter brings opportunities for ice skating and Christmas light displays. Stanley Park is more than just a park; it is a cherished natural treasure that provides Vancouver residents and visitors with a place to connect with nature, engage in recreation, and find peace amid the urban landscape. Its beauty and diversity make it one of the most beloved urban parks in the world, a testament to the importance of preserving natural spaces within cities.`,
                        translation: `斯坦利公园是不列颠哥伦比亚省温哥华的一个1,001英亩城市公园，是自然美景的杰作，无缝融合了原始荒野和精心设计的娱乐空间。当你通过其宏伟的入口进入公园时，你会立即被远处北海岸山脉的景象所震撼，它们的雪顶山峰为下面郁郁葱葱的绿色植物提供了戏剧性的背景。公园最著名的特色，海堤，是一条9公里长的铺砌小路，沿着公园的周边蜿蜒，提供了太平洋、英吉利湾和远处海湾群岛的 breathtaking 景色。沿着海堤，慢跑者、骑自行车者和轮滑者与步行者共享小路，他们停下来欣赏栖息在岩石上的海狮或观看皮划艇运动员在水面上滑行。在内陆，公园被一系列小径纵横交错，这些小径穿过古老的雨林，那里高耸的道格拉斯冷杉和西部红雪松，有些超过500年历史，用它们巨大的树干和密集的树冠创造了一种大教堂般的氛围。阳光透过树叶以斑驳的图案过滤，照亮了长满苔藓的地面，创造了一种宁静的感觉，感觉远离公园边界外繁忙的城市。公园也是各种野生动物的家园，包括松鼠、浣熊和200多种鸟类，使其成为自然爱好者的天堂。对于家庭，公园提供温哥华水族馆，展示来自西北太平洋的海洋生物，以及斯坦利公园铁路，一列微型火车带游客通过公园进行风景之旅。失落的泻湖，公园入口附近的淡水湖，是观鸟的热门地点，其木板路提供了鸭子、天鹅和苍鹭的近距离视图。在夏天，公园充满了户外音乐会、戏剧表演和节日，而冬天则带来了滑冰和圣诞灯光展示的机会。斯坦利公园不仅仅是一个公园；它是一个被珍视的自然宝藏，为温哥居民和游客提供了一个与自然联系、参与娱乐和在城市景观中寻找和平的地方。它的美丽和多样性使其成为世界上最受喜爱的城市公园之一，证明了在城市内保护自然空间的重要性。`
                    }
                }
            }
        };
        
        // 根据类型、长度和水平返回相应的作文
        return essays[type][length][level];
    }
    
    // 显示生成的作文
    displayGeneratedEssay(container, topic, essay) {
        container.innerHTML = `
            <h4>为主题 "${topic}" 生成的作文</h4>
            <div class="essay-content">
                <div class="english-essay">
                    <h5>英文作文</h5>
                    <p>${essay.content}</p>
                </div>
                <div class="chinese-translation">
                    <h5>中文翻译</h5>
                    <p>${essay.translation}</p>
                </div>
            </div>
        `;
        
        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .essay-content {
                margin-top: 20px;
            }
            .english-essay,
            .chinese-translation {
                margin-bottom: 30px;
                padding: 20px;
                background-color: rgba(90, 115, 215, 0.05);
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .english-essay h5,
            .chinese-translation h5 {
                margin-top: 0;
                color: #4361ee;
                margin-bottom: 15px;
            }
            .english-essay p,
            .chinese-translation p {
                margin: 0;
                line-height: 1.6;
            }
            .english-essay p {
                color: #333;
            }
            .chinese-translation p {
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化词汇学习功能
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (typeof Vocabulary !== 'undefined') {
            const vocabulary = new Vocabulary();
            vocabulary.initAllFeatures();
        }
    }, 1000);
});