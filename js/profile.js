class Profile {
    constructor() {
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupSettings();
        this.renderStats();
        this.renderHistory();
        // 初始化加载所有头像
        this.loadAllAvatars();
        // 初始化图片裁剪功能
        this.initCropFunctionality();
    }

    // 设置标签页
    setupTabs() {
        const profileTabs = document.querySelectorAll('.profile-tabs .tab-btn');
        profileTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 移除所有活动状态
                profileTabs.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.profile-tabs .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 添加活动状态
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 设置设置页面
    setupSettings() {
        const saveSettingsBtn = document.getElementById('save-settings');
        const darkModeToggle = document.getElementById('dark-mode');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const avatarUploadBtn = document.getElementById('avatar-upload-btn');
        const avatarUpload = document.getElementById('avatar-upload');
        const avatarPreview = document.getElementById('avatar-preview');

        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        if (darkModeToggle) {
            // 加载保存的深色模式设置
            const isDarkMode = localStorage.getItem('darkMode') === 'true';
            darkModeToggle.checked = isDarkMode;

            darkModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        }

        // 头像上传功能
        if (avatarUploadBtn && avatarUpload && avatarPreview) {
            avatarUploadBtn.addEventListener('click', () => {
                avatarUpload.click();
            });

            avatarUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewAvatar(file, avatarPreview);
                }
            });
        }

        // 加载用户设置
        this.loadSettings(usernameInput, emailInput);
        // 加载保存的头像
        this.loadAvatar(avatarPreview);
    }

    // 预览头像
    previewAvatar(file, previewElement) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarData = e.target.result;
            // 更新预览元素
            if (previewElement) {
                previewElement.src = avatarData;
            }
            // 保存头像到localStorage
            this.saveAvatar(avatarData);
            // 更新所有地方的头像
            this.updateAllAvatars(avatarData);
            // 启用裁剪按钮
            const cropBtn = document.getElementById('avatar-crop-btn');
            if (cropBtn) {
                cropBtn.disabled = false;
            }
        };
        reader.readAsDataURL(file);
    }

    // 初始化图片裁剪功能
    initCropFunctionality() {
        const cropBtn = document.getElementById('avatar-crop-btn');
        if (cropBtn) {
            cropBtn.addEventListener('click', () => {
                this.performCrop();
            });
        }
    }

    // 执行图片裁剪
    performCrop() {
        const previewElement = document.getElementById('avatar-preview');
        if (previewElement) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // 设置裁剪参数（正方形裁剪）
                const size = Math.min(img.width, img.height);
                const x = (img.width - size) / 2;
                const y = (img.height - size) / 2;
                
                canvas.width = 200;
                canvas.height = 200;
                
                // 绘制裁剪后的图像
                ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);
                
                // 获取裁剪后的图像数据
                const croppedData = canvas.toDataURL('image/png');
                
                // 更新预览和保存
                previewElement.src = croppedData;
                this.saveAvatar(croppedData);
                this.updateAllAvatars(croppedData);
                
                alert('图片裁剪成功！');
            };
            
            img.src = previewElement.src;
        }
    }

    // 保存头像
    saveAvatar(avatarData) {
        localStorage.setItem('userAvatar', avatarData);
    }

    // 加载头像
    loadAvatar(previewElement) {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            // 更新预览元素
            if (previewElement) {
                previewElement.src = savedAvatar;
            }
            // 更新所有地方的头像
            this.updateAllAvatars(savedAvatar);
        }
    }

    // 更新所有地方的头像
    updateAllAvatars(avatarData) {
        // 更新个人中心头部的头像
        const profileAvatar = document.querySelector('.profile-avatar img');
        if (profileAvatar) {
            profileAvatar.src = avatarData;
        }
        // 更新设置页面的预览头像
        const settingsAvatar = document.getElementById('avatar-preview');
        if (settingsAvatar) {
            settingsAvatar.src = avatarData;
        }
        // 强制刷新所有头像元素，确保图片更新
        setTimeout(() => {
            if (profileAvatar) {
                profileAvatar.src = avatarData + '?' + new Date().getTime();
            }
            if (settingsAvatar) {
                settingsAvatar.src = avatarData + '?' + new Date().getTime();
            }
        }, 100);
    }

    // 初始化时加载头像
    loadAllAvatars() {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            this.updateAllAvatars(savedAvatar);
        }
    }

    // 保存设置
    saveSettings() {
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        const settings = {
            username: usernameInput.value,
            email: emailInput.value
        };

        // 只有当密码不为空时才保存
        if (passwordInput.value) {
            settings.password = passwordInput.value;
        }

        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // 更新用户信息
        const userData = main.getUserData();
        if (usernameInput.value) {
            userData.username = usernameInput.value;
            main.saveUserData(userData);
        }

        alert('设置保存成功！');
    }

    // 加载设置
    loadSettings(usernameInput, emailInput) {
        const settings = localStorage.getItem('userSettings');
        if (settings) {
            const parsedSettings = JSON.parse(settings);
            if (usernameInput) {
                usernameInput.value = parsedSettings.username || '';
            }
            if (emailInput) {
                emailInput.value = parsedSettings.email || '';
            }
        }

        // 加载用户数据
        const userData = main.getUserData();
        if (usernameInput && !usernameInput.value) {
            usernameInput.value = userData.username || '';
        }
    }

    // 渲染统计信息
    renderStats() {
        const userData = main.getUserData();
        
        // 更新统计卡片
        document.getElementById('total-words').textContent = userData.wordsLearned;
        document.getElementById('correct-answers').textContent = userData.correctAnswers;
        document.getElementById('learning-time').textContent = userData.learningTime;
        document.getElementById('achievements-count').textContent = userData.achievements.length;

        // 渲染学习趋势图表
        this.renderLearningChart();
    }

    // 渲染学习趋势图表
    renderLearningChart() {
        const chartContainer = document.getElementById('learning-chart');
        if (chartContainer) {
            // 生成最近7天的学习数据
            const learningData = this.generateLearningData();
            
            // 简单的图表渲染
            chartContainer.innerHTML = `
                <div class="chart">
                    ${learningData.map((data, index) => {
                        const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                        const today = new Date();
                        const dayIndex = (today.getDay() - 6 + index + 7) % 7;
                        return `
                            <div class="chart-bar">
                                <div class="bar" style="height: ${data}px;"></div>
                                <div class="bar-label">${dayNames[dayIndex]}</div>
                                <div class="bar-value">${data}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
    }

    // 生成学习数据
    generateLearningData() {
        // 这里可以从本地存储加载实际数据
        // 现在生成模拟数据
        const data = [];
        for (let i = 0; i < 7; i++) {
            data.push(Math.floor(Math.random() * 100) + 20);
        }
        return data;
    }

    // 渲染学习历史
    renderHistory() {
        const historyList = document.getElementById('history-list');
        if (historyList) {
            const historyData = this.loadHistoryData();
            
            historyList.innerHTML = '';
            
            if (historyData.length === 0) {
                historyList.innerHTML = '<p class="no-history">暂无学习历史</p>';
                return;
            }
            
            historyData.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-info">
                        <h4>${item.activity}</h4>
                        <p>${item.description}</p>
                    </div>
                    <div class="history-date">
                        <span>${item.date}</span>
                        <span>${item.time}</span>
                    </div>
                `;
                historyList.appendChild(historyItem);
            });
        }
    }

    // 加载历史数据
    loadHistoryData() {
        const history = localStorage.getItem('learningHistory');
        if (history) {
            return JSON.parse(history);
        }

        // 生成模拟数据
        const mockHistory = [
            {
                activity: '词汇学习',
                description: '学习了10个新单词',
                date: '2026-02-11',
                time: '14:30'
            },
            {
                activity: '记忆卡片游戏',
                description: '完成了一局记忆卡片游戏，正确率80%',
                date: '2026-02-11',
                time: '13:45'
            },
            {
                activity: 'Quiz游戏',
                description: '完成了Quiz游戏，得分90分',
                date: '2026-02-10',
                time: '16:20'
            },
            {
                activity: '口语练习',
                description: '练习了5个音频文件',
                date: '2026-02-10',
                time: '10:15'
            },
            {
                activity: '匹配游戏',
                description: '完成了匹配游戏，用时2分钟',
                date: '2026-02-09',
                time: '15:30'
            }
        ];

        localStorage.setItem('learningHistory', JSON.stringify(mockHistory));
        return mockHistory;
    }

    // 添加历史记录
    addHistoryRecord(activity, description) {
        const history = this.loadHistoryData();
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 5);

        const newRecord = {
            activity: activity,
            description: description,
            date: date,
            time: time
        };

        history.unshift(newRecord);
        
        // 只保留最近20条记录
        if (history.length > 20) {
            history.splice(20);
        }

        localStorage.setItem('learningHistory', JSON.stringify(history));
        this.renderHistory();
    }
}

// 初始化个人中心
const profile = new Profile();

// 导出profile实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = profile;
} else {
    window.profile = profile;
}