class Main {
    constructor() {
        this.currentSection = 'home';
        this.audioPlayer = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModals();
        this.setupDarkMode();
        this.setupAudioPlayer();
        this.setupEasterEgg();
        this.loadUserData();
    }

    // 设置彩蛋功能
    setupEasterEgg() {
        const easterEggTrigger = document.getElementById('easter-egg-trigger');
        if (easterEggTrigger) {
            let clickCount = 0;
            easterEggTrigger.addEventListener('click', () => {
                clickCount++;
                if (clickCount >= 10) {
                    this.showEasterEgg();
                    clickCount = 0;
                }
            });
        }
    }

    // 显示彩蛋页面
    showEasterEgg() {
        // 创建彩蛋模态框
        const easterEggModal = document.createElement('div');
        easterEggModal.className = 'modal active';
        easterEggModal.id = 'easter-egg-modal';
        easterEggModal.innerHTML = `
            <div class="modal-content" style="max-width: 950px; background: linear-gradient(135deg, #f0f9f0 0%, #d6f0d6 100%); border: none; border-radius: 20px; box-shadow: 0 15px 35px rgba(62,161,68,0.2);">
                <div class="modal-header" style="background: linear-gradient(135deg, #66d96d 0%, #3a9e40 100%); color: white; border-radius: 20px 20px 0 0; padding: 25px 35px; text-align: center;">
                    <h3 style="margin: 0; font-size: 1.8rem; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🎉 彩蛋发现！</h3>
                    <button class="close-modal" style="background: rgba(255,255,255,0.25); border: none; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: absolute; top: 15px; right: 15px; transition: all 0.3s ease;">&times;</button>
                </div>
                <div class="modal-body" style="text-align: center; padding: 50px; background: #f0f9f0;">
                    <h2 style="color: #3a9e40; margin-bottom: 20px; font-size: 2rem; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-shadow: 0 2px 4px rgba(62,161,68,0.1);">恭喜你发现了隐藏彩蛋！</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 40px; color: #4a6e4a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">你是真正的英语学习大师探索者！</p>
                    
                    <!-- 视频播放器 -->
                    <div style="margin-bottom: 40px; position: relative; display: inline-block; width: 100%; max-width: 800px; background: linear-gradient(135deg, #e8f5e8 0%, #d0e8d0 100%); border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(62,161,68,0.15);">
                        <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #e8f5e8; border-radius: 12px; overflow: hidden; box-shadow: inset 0 2px 8px rgba(0,0,0,0.1);">
                            <video id="easter-egg-video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">
                                <source src="彩蛋/视频/屏幕录制 2026-02-11 210916.mp4" type="video/mp4">
                                您的浏览器不支持视频播放。
                            </video>
                            <!-- 视频控制层 -->
                            <div id="video-controls" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; padding: 20px; border-radius: 0 0 12px 12px; transition: all 0.3s ease;">
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <button id="play-pause-btn" style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                        <i class="fas fa-play"></i>
                                    </button>
                                    <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px; cursor: pointer; position: relative; transition: all 0.3s ease;">
                                        <div id="progress-bar" style="height: 100%; background: linear-gradient(90deg, #66d96d 0%, #3a9e40 100%); border-radius: 4px; width: 0%; transition: width 0.1s linear;"></div>
                                    </div>
                                    <div id="time-display" style="font-size: 14px; min-width: 90px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 500;">0:00 / 0:00</div>
                                    <button id="fullscreen-btn" style="background: rgba(255,255,255,0.3); border: none; color: white; border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
                                        <i class="fas fa-expand"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #66d96d 0%, #3a9e40 100%); color: white; padding: 35px; border-radius: 16px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(62,161,68,0.25);">
                        <h3 style="margin-top: 0; margin-bottom: 25px; font-size: 1.5rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 700;">特殊奖励</h3>
                        <p style="margin: 12px 0; font-size: 1.2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">获得 1000 积分奖励！</p>
                        <p style="margin: 12px 0; font-size: 1.2rem; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">获得 "彩蛋探索者" 成就！</p>
                    </div>
                    <button id="claim-reward" style="background: linear-gradient(135deg, #66d96d 0%, #3a9e40 100%); color: white; border: none; padding: 16px 40px; border-radius: 35px; font-size: 1.2rem; font-weight: 700; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(62,161,68,0.4); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        领取奖励
                    </button>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(easterEggModal);
        
        // 关闭模态框
        const closeModal = easterEggModal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            // 暂停视频
            const video = document.getElementById('easter-egg-video');
            if (video) {
                video.pause();
            }
            easterEggModal.remove();
        });
        
        // 点击外部关闭
        easterEggModal.addEventListener('click', (e) => {
            if (e.target === easterEggModal) {
                // 暂停视频
                const video = document.getElementById('easter-egg-video');
                if (video) {
                    video.pause();
                }
                easterEggModal.remove();
            }
        });
        
        // 视频播放控制
        const video = document.getElementById('easter-egg-video');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const progressBarContainer = document.querySelector('#video-controls > div');
        const progressBar = document.getElementById('progress-bar');
        const timeDisplay = document.getElementById('time-display');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        if (video && progressBarContainer) {
            // 获取实际的进度条容器
            const actualProgressBarContainer = progressBarContainer.querySelector('div[style*="flex: 1"]');
            
            // 播放/暂停控制
            playPauseBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            // 视频结束时重置按钮
            video.addEventListener('ended', () => {
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
            
            // 时间更新
            video.addEventListener('timeupdate', () => {
                if (!isNaN(video.duration) && video.duration > 0) {
                    const percent = (video.currentTime / video.duration) * 100;
                    progressBar.style.width = percent + '%';
                    
                    // 更新时间显示
                    const currentTime = this.formatTime(video.currentTime);
                    const duration = this.formatTime(video.duration);
                    timeDisplay.textContent = `${currentTime} / ${duration}`;
                }
            });
            
            // 视频加载完成后更新总时长
            video.addEventListener('loadedmetadata', () => {
                if (!isNaN(video.duration) && video.duration > 0) {
                    const duration = this.formatTime(video.duration);
                    timeDisplay.textContent = `0:00 / ${duration}`;
                }
            });
            
            // 进度条点击
            if (actualProgressBarContainer) {
                actualProgressBarContainer.addEventListener('click', (e) => {
                    if (!isNaN(video.duration) && video.duration > 0) {
                        const rect = actualProgressBarContainer.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        const newTime = pos * video.duration;
                        video.currentTime = newTime;
                    }
                });
            }
            
            // 全屏控制
            fullscreenBtn.addEventListener('click', () => {
                const videoContainer = video.parentElement;
                if (!document.fullscreenElement) {
                    if (videoContainer.requestFullscreen) {
                        videoContainer.requestFullscreen();
                    } else if (videoContainer.mozRequestFullScreen) {
                        videoContainer.mozRequestFullScreen();
                    } else if (videoContainer.webkitRequestFullscreen) {
                        videoContainer.webkitRequestFullscreen();
                    } else if (videoContainer.msRequestFullscreen) {
                        videoContainer.msRequestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                }
            });
            
            // 全屏状态变化
            const updateFullscreenIcon = () => {
                if (!document.fullscreenElement) {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                } else {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                }
            };
            
            document.addEventListener('fullscreenchange', updateFullscreenIcon);
            document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
            document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
            document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
        }
        
        // 领取奖励
        const claimReward = document.getElementById('claim-reward');
        claimReward.addEventListener('click', () => {
            this.addPoints(1000);
            this.addAchievement('easter_egg_explorer');
            alert('恭喜获得 1000 积分和 "彩蛋探索者" 成就！');
            
            // 暂停视频
            const video = document.getElementById('easter-egg-video');
            if (video) {
                video.pause();
            }
            
            easterEggModal.remove();
        });
    }
    
    // 格式化时间
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 设置导航
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        // 处理导航栏链接
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateTo(targetId);
            });
        });

        // 处理首页功能卡片链接
        const featureLinks = document.querySelectorAll('.feature-card');
        featureLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.navigateTo(targetId);
            });
        });

        // 处理其他锚点链接
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            // 跳过已经处理过的链接
            if (!link.classList.contains('nav-link') && !link.classList.contains('feature-card')) {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href').substring(1);
                    // 如果是有效的章节ID，则阻止默认行为并导航
                    if (document.getElementById(targetId)) {
                        e.preventDefault();
                        this.navigateTo(targetId);
                    }
                });
            }
        });

        // 点击其他地方关闭下拉菜单等
        document.addEventListener('click', (e) => {
            // 可以添加其他点击事件处理
        });
    }

    // 导航到指定章节
    navigateTo(sectionId) {
        // 移除所有活动状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加活动状态到导航链接
        document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
        
        // 切换章节
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.style.display = 'block';
                // 触发重排，确保过渡效果生效
                void section.offsetWidth;
                section.classList.add('active');
            } else {
                section.classList.remove('active');
                // 延迟隐藏，等待过渡效果完成
                setTimeout(() => {
                    if (!section.classList.contains('active')) {
                        section.style.display = 'none';
                    }
                }, 600);
            }
        });

        // 关闭音频播放器
        const audioPlayer = document.getElementById('audio-player');
        if (audioPlayer && audioPlayer.classList.contains('active')) {
            audioPlayer.classList.remove('active');
            // 暂停fun-learn中的音频
            if (window.funLearn && window.funLearn.audioElement) {
                window.funLearn.audioElement.pause();
                window.funLearn.isPlaying = false;
                const audioPlay = document.getElementById('audio-play');
                if (audioPlay) {
                    audioPlay.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
        }

        this.currentSection = sectionId;
    }

    // 设置模态框
    setupModals() {
        // 登录模态框
        const loginBtn = document.getElementById('login-btn');
        const loginModal = document.getElementById('login-modal');
        const closeLogin = loginModal.querySelector('.close-modal');
        const loginSubmit = document.getElementById('login-submit');

        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });

        closeLogin.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });

        loginSubmit.addEventListener('click', () => {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            if (username && password) {
                this.loginUser(username);
                loginModal.classList.remove('active');
            }
        });

        // 注册模态框
        const registerBtn = document.getElementById('register-btn');
        const registerModal = document.getElementById('register-modal');
        const closeRegister = registerModal.querySelector('.close-modal');
        const registerSubmit = document.getElementById('register-submit');

        registerBtn.addEventListener('click', () => {
            registerModal.classList.add('active');
        });

        closeRegister.addEventListener('click', () => {
            registerModal.classList.remove('active');
        });

        registerSubmit.addEventListener('click', () => {
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            if (username && email && password) {
                this.registerUser(username, email, password);
                registerModal.classList.remove('active');
            }
        });

        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
            if (e.target === registerModal) {
                registerModal.classList.remove('active');
            }
        });
    }

    // 设置深色模式
    setupDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode');
        
        if (darkModeToggle) {
            // 加载保存的深色模式设置
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            if (isDarkMode) {
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }

            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        }
    }

    // 设置音频播放器
    setupAudioPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        const closeAudio = audioPlayer.querySelector('.close-audio');

        if (closeAudio) {
            closeAudio.addEventListener('click', () => {
                audioPlayer.classList.remove('active');
                // 暂停fun-learn中的音频
                if (window.funLearn && window.funLearn.audioElement) {
                    window.funLearn.audioElement.pause();
                    window.funLearn.isPlaying = false;
                    const audioPlay = document.getElementById('audio-play');
                    if (audioPlay) {
                        audioPlay.innerHTML = '<i class="fas fa-play"></i>';
                    }
                }
            });
        }
    }

    // 打开音频播放器
    openAudioPlayer() {
        const audioPlayer = document.getElementById('audio-player');
        audioPlayer.classList.add('active');
    }

    // 登录用户
    loginUser(username) {
        const userData = {
            username: username,
            level: 1,
            experience: 0,
            points: 1000,
            wordsLearned: 0,
            correctAnswers: 0,
            learningTime: 0,
            achievements: []
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        this.updateUserInfo(userData);
        alert('登录成功！');
    }

    // 注册用户
    registerUser(username, email, password) {
        const userData = {
            username: username,
            email: email,
            level: 1,
            experience: 0,
            points: 1500,
            wordsLearned: 0,
            correctAnswers: 0,
            learningTime: 0,
            achievements: []
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        this.updateUserInfo(userData);
        alert('注册成功！');
    }

    // 加载用户数据
    loadUserData() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            this.updateUserInfo(JSON.parse(userData));
        }
    }

    // 更新用户信息
    updateUserInfo(userData) {
        const userName = document.getElementById('user-name');
        const userLevel = document.getElementById('user-level');
        const levelProgressBar = document.getElementById('level-progress-bar');
        const levelProgressText = document.getElementById('level-progress-text');
        const availablePoints = document.getElementById('available-points');
        const totalWords = document.getElementById('total-words');
        const correctAnswers = document.getElementById('correct-answers');
        const learningTime = document.getElementById('learning-time');
        const achievementsCount = document.getElementById('achievements-count');

        if (userName) userName.textContent = userData.username;
        if (userLevel) userLevel.textContent = `等级 ${userData.level}`;
        
        const levelExp = userData.level * 1000;
        const progress = (userData.experience / levelExp) * 100;
        if (levelProgressBar) levelProgressBar.style.width = `${progress}%`;
        if (levelProgressText) levelProgressText.textContent = `${Math.round(progress)}%`;
        if (availablePoints) availablePoints.textContent = userData.points;
        if (totalWords) totalWords.textContent = userData.wordsLearned;
        if (correctAnswers) correctAnswers.textContent = userData.correctAnswers;
        if (learningTime) learningTime.textContent = userData.learningTime;
        if (achievementsCount) achievementsCount.textContent = userData.achievements.length;
    }

    // 保存用户数据
    saveUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        this.updateUserInfo(userData);
    }

    // 获取用户数据
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : {
            username: '游客',
            level: 1,
            experience: 0,
            points: 1000,
            wordsLearned: 0,
            correctAnswers: 0,
            learningTime: 0,
            achievements: []
        };
    }

    // 添加经验值
    addExperience(amount) {
        const userData = this.getUserData();
        userData.experience += amount;
        
        // 检查是否升级
        const levelExp = userData.level * 1000;
        if (userData.experience >= levelExp) {
            userData.level++;
            userData.experience -= levelExp;
            userData.points += 500;
            alert(`恭喜升级到 ${userData.level} 级！获得 500 积分奖励！`);
        }

        this.saveUserData(userData);
    }

    // 添加积分
    addPoints(amount) {
        const userData = this.getUserData();
        userData.points += amount;
        this.saveUserData(userData);
    }

    // 消耗积分
    spendPoints(amount) {
        const userData = this.getUserData();
        if (userData.points >= amount) {
            userData.points -= amount;
            this.saveUserData(userData);
            return true;
        }
        alert('积分不足！');
        return false;
    }

    // 记录学习时间
    addLearningTime(minutes) {
        const userData = this.getUserData();
        userData.learningTime += minutes;
        this.saveUserData(userData);
    }

    // 添加成就
    addAchievement(achievementId) {
        const userData = this.getUserData();
        if (!userData.achievements.includes(achievementId)) {
            userData.achievements.push(achievementId);
            this.saveUserData(userData);
            
            // 播放成就解锁音效
            this.playAchievementSound();
            
            // 显示实时成就通知
            this.showAchievementNotification(achievementId);
        }
    }
    
    // 显示成就通知
    showAchievementNotification(achievementId) {
        // 确保成就通知容器存在
        let notificationContainer = document.getElementById('achievement-notifications');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'achievement-notifications';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '10000';
            notificationContainer.style.display = 'flex';
            notificationContainer.style.flexDirection = 'column';
            notificationContainer.style.alignItems = 'flex-end';
            notificationContainer.style.gap = '10px';
            document.body.appendChild(notificationContainer);
        }
        
        // 创建成就通知元素
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = 'bold';
        notification.style.animation = 'slideInRight 0.3s ease-out forwards, fadeOut 0.3s ease-in 3.7s forwards';
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        notification.style.minWidth = '200px';
        notification.style.textAlign = 'center';
        
        // 添加成就图标
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🏆</div>
                <div>
                    <div style="font-size: 16px; font-weight: bold;">成就解锁！</div>
                    <div style="font-size: 12px; opacity: 0.9;">${this.getAchievementName(achievementId)}</div>
                </div>
            </div>
        `;
        
        // 添加到容器
        notificationContainer.appendChild(notification);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
        
        // 4秒后移除通知
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 4000);
    }
    
    // 获取成就名称
    getAchievementName(achievementId) {
        const achievementNames = {
            'easter_egg_explorer': '彩蛋探索者',
            'memory_master': '记忆大师',
            'matching_master': '匹配大师',
            'quiz_master': 'Quiz大师',
            'vocabulary_master': '词汇大师',
            'typing_master': '打字大师'
        };
        return achievementNames[achievementId] || '新成就';
    }

    // 播放成就解锁音效
    playAchievementSound() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            // 使用Web Audio API创建音效
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            
            // 创建主振荡器
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            // 设置音效参数
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.5);
            
            // 设置音量包络
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            
            // 播放音效
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.5);
            
            // 添加一个和谐音
            setTimeout(() => {
                const oscillator2 = ctx.createOscillator();
                const gainNode2 = ctx.createGain();
                
                oscillator2.connect(gainNode2);
                gainNode2.connect(ctx.destination);
                
                oscillator2.type = 'sine';
                oscillator2.frequency.setValueAtTime(1200, ctx.currentTime);
                oscillator2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
                
                gainNode2.gain.setValueAtTime(0, ctx.currentTime);
                gainNode2.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                
                oscillator2.start(ctx.currentTime);
                oscillator2.stop(ctx.currentTime + 0.3);
            }, 150);
        }
    }
}

// 初始化应用
const main = new Main();

// 导出main实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
} else {
    window.main = main;
}