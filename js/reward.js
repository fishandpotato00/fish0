class Reward {
    constructor() {
        this.achievements = this.loadAchievements();
        this.init();
    }

    init() {
        this.setupTabs();
        this.renderAchievements();
    }

    // 设置标签页
    setupTabs() {
        const rewardTabs = document.querySelectorAll('.reward-tabs .tab-btn');
        rewardTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 移除所有活动状态
                rewardTabs.forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.reward-tabs .tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // 添加活动状态
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }

    // 加载成就数据
    loadAchievements() {
        return [
            // 学习基础成就
            {
                id: 'first_learning',
                name: '初次学习',
                description: '完成第一次词汇学习',
                icon: 'fas fa-book',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'word_master',
                name: '词汇大师',
                description: '学习100个单词',
                icon: 'fas fa-award',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'vocabulary_expert',
                name: '词汇专家',
                description: '学习500个单词',
                icon: 'fas fa-language',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'vocabulary_pro',
                name: '词汇教授',
                description: '学习1000个单词',
                icon: 'fas fa-graduation-cap',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'streak_7',
                name: '坚持一周',
                description: '连续学习7天',
                icon: 'fas fa-calendar-check',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'streak_30',
                name: '月度达人',
                description: '连续学习30天',
                icon: 'fas fa-calendar-alt',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'streak_90',
                name: '季度大师',
                description: '连续学习90天',
                icon: 'fas fa-calendar-week',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'listening_master',
                name: '听力大师',
                description: '完成50次听力练习',
                icon: 'fas fa-headphones',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'audio_master',
                name: '音频大师',
                description: '播放100个单词的音频',
                icon: 'fas fa-volume-up',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'review_master',
                name: '复习大师',
                description: '完成100次复习',
                icon: 'fas fa-redo',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'sentence_master',
                name: '句子大师',
                description: '生成50个句子',
                icon: 'fas fa-comment-dots',
                category: 'learning',
                unlocked: false
            },
            
            // 游戏成就
            {
                id: 'memory_master',
                name: '记忆大师',
                description: '完成记忆卡片游戏',
                icon: 'fas fa-memory',
                category: 'games',
                unlocked: false
            },
            {
                id: 'matching_master',
                name: '匹配大师',
                description: '完成匹配游戏',
                icon: 'fas fa-puzzle-piece',
                category: 'games',
                unlocked: false
            },
            {
                id: 'quiz_master',
                name: 'Quiz大师',
                description: 'Quiz游戏得分80分以上',
                icon: 'fas fa-question-circle',
                category: 'games',
                unlocked: false
            },
            {
                id: 'game_master',
                name: '游戏大师',
                description: '完成所有趣味游戏',
                icon: 'fas fa-gamepad',
                category: 'games',
                unlocked: false
            },
            {
                id: 'typing_master',
                name: '打字大师',
                description: '在打单词游戏中得分超过1000分',
                icon: 'fas fa-keyboard',
                category: 'games',
                unlocked: false
            },
            {
                id: 'evacuation_master',
                name: '撤离大师',
                description: '在搜打撤游戏中成功撤离',
                icon: 'fas fa-running',
                category: 'games',
                unlocked: false
            },
            
            // 积分成就
            {
                id: 'points_collector',
                name: '积分收藏家',
                description: '累计获得5000积分',
                icon: 'fas fa-piggy-bank',
                category: 'points',
                unlocked: false
            },
            {
                id: 'points_master',
                name: '积分大师',
                description: '累计获得10000积分',
                icon: 'fas fa-coins',
                category: 'points',
                unlocked: false
            },
            {
                id: 'points_king',
                name: '积分之王',
                description: '累计获得50000积分',
                icon: 'fas fa-crown',
                category: 'points',
                unlocked: false
            },
            
            // 等级成就
            {
                id: 'level_10',
                name: '十级达人',
                description: '达到10级',
                icon: 'fas fa-star',
                category: 'level',
                unlocked: false
            },
            {
                id: 'level_20',
                name: '二十级大师',
                description: '达到20级',
                icon: 'fas fa-star-half-alt',
                category: 'level',
                unlocked: false
            },
            {
                id: 'level_30',
                name: '三十级王者',
                description: '达到30级',
                icon: 'fas fa-crown',
                category: 'level',
                unlocked: false
            },
            
            // 成就系统
            {
                id: 'achievement_hunter',
                name: '成就猎人',
                description: '解锁10个成就',
                icon: 'fas fa-trophy',
                category: 'achievement',
                unlocked: false
            },
            {
                id: 'achievement_master',
                name: '成就大师',
                description: '解锁所有成就',
                icon: 'fas fa-award',
                category: 'achievement',
                unlocked: false
            },
            {
                id: 'achievement_collector',
                name: '成就收藏家',
                description: '解锁20个成就',
                icon: 'fas fa-collections',
                category: 'achievement',
                unlocked: false
            },
            
            // 彩蛋成就
            {
                id: 'easter_egg_explorer',
                name: '彩蛋探索者',
                description: '发现隐藏彩蛋',
                icon: 'fas fa-egg',
                category: 'easter_egg',
                unlocked: false
            },
            {
                id: 'luo_xiao_hei_found',
                name: '罗小黑发现者',
                description: '第一次发现罗小黑彩蛋',
                icon: 'fas fa-cat',
                category: 'easter_egg',
                unlocked: false
            },
            {
                id: 'easter_egg_master',
                name: '彩蛋大师',
                description: '发现所有彩蛋',
                icon: 'fas fa-hat-wizard',
                category: 'easter_egg',
                unlocked: false
            },
            
            // 新增成就
            {
                id: 'vocabulary_completionist',
                name: '词汇收集者',
                description: '学习所有D开头的单词',
                icon: 'fas fa-book-open',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'daily_streak_100',
                name: '百日达人',
                description: '连续学习100天',
                icon: 'fas fa-fire',
                category: 'learning',
                unlocked: false
            },
            {
                id: 'quiz_champion',
                name: 'Quiz冠军',
                description: 'Quiz游戏得分100分',
                icon: 'fas fa-trophy',
                category: 'games',
                unlocked: false
            }
        ];
    }


    
    // 按类别分组成就
    groupAchievementsByCategory() {
        const groups = {};
        
        this.achievements.forEach(achievement => {
            if (!groups[achievement.category]) {
                groups[achievement.category] = [];
            }
            groups[achievement.category].push(achievement);
        });
        
        return groups;
    }
    
    // 获取类别显示名称
    getCategoryDisplayName(category) {
        const categoryNames = {
            'learning': '学习成就',
            'games': '游戏成就',
            'achievement': '成就成就',
            'points': '积分成就',
            'level': '等级成就',
            'easter_egg': '罗小黑彩蛋成就'
        };
        return categoryNames[category] || category;
    }
    
    // 渲染成就
    renderAchievements() {
        const achievementsList = document.getElementById('achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = '';
            
            const userData = main.getUserData();
            const unlockedAchievementIds = new Set(userData.achievements);
            
            // 检查是否已解锁罗小黑彩蛋成就
            const hasLuoXiaoHeiAchievement = unlockedAchievementIds.has('luo_xiao_hei_found');
            
            // 添加统计概览
            this.renderAchievementOverview(unlockedAchievementIds);
            
            // 按类别分组成就
            const achievementsByCategory = this.groupAchievementsByCategory();
            
            // 渲染每个类别的成就
            Object.entries(achievementsByCategory).forEach(([category, categoryAchievements]) => {
                const categorySection = document.createElement('div');
                categorySection.className = 'achievement-category';
                
                // 类别标题
                const categoryTitle = document.createElement('h3');
                categoryTitle.textContent = this.getCategoryDisplayName(category);
                categorySection.appendChild(categoryTitle);
                
                // 成就网格
                const categoryGrid = document.createElement('div');
                categoryGrid.style.display = 'grid';
                categoryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
                categoryGrid.style.gap = '24px';
                categoryGrid.style.marginTop = '24px';
                
                // 为彩蛋成就添加雾效
                if (category === 'easter_egg' && !hasLuoXiaoHeiAchievement) {
                    categorySection.style.position = 'relative';
                    const fogEffect = document.createElement('div');
                    fogEffect.style.position = 'absolute';
                    fogEffect.style.top = '0';
                    fogEffect.style.left = '0';
                    fogEffect.style.right = '0';
                    fogEffect.style.bottom = '0';
                    fogEffect.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    fogEffect.style.backdropFilter = 'blur(12px)';
                    fogEffect.style.borderRadius = '16px';
                    fogEffect.style.zIndex = '1';
                    fogEffect.style.display = 'flex';
                    fogEffect.style.alignItems = 'center';
                    fogEffect.style.justifyContent = 'center';
                    fogEffect.style.padding = '60px';
                    fogEffect.innerHTML = `
                        <div style="text-align: center;">
                            <i class="fas fa-cloud" style="font-size: 4rem; color: rgba(67, 97, 238, 0.2); margin-bottom: 24px;"></i>
                            <h4 style="color: var(--premium-text); margin-bottom: 16px; font-size: 1.4rem;">探索词汇筛选</h4>
                            <p style="color: var(--premium-subtext); margin: 0; font-size: 1.1rem; line-height: 1.6;">寻找隐藏的彩蛋，解锁罗小黑的秘密...</p>
                        </div>
                    `;
                    categorySection.appendChild(fogEffect);
                }
                
                categoryAchievements.forEach(achievement => {
                    const isUnlocked = unlockedAchievementIds.has(achievement.id);
                    const achievementCard = document.createElement('div');
                    achievementCard.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'} ${category === 'easter_egg' ? 'easter-egg' : ''}`;
                    
                    // 成就头部
                    const achievementHeader = document.createElement('div');
                    achievementHeader.className = 'achievement-header';
                    
                    // 成就图标
                    const achievementIcon = document.createElement('div');
                    achievementIcon.className = 'achievement-icon';
                    achievementIcon.innerHTML = `<i class="${achievement.icon}"></i>`;
                    
                    // 成就信息
                    const achievementInfo = document.createElement('div');
                    achievementInfo.className = 'achievement-info';
                    
                    const nameElement = document.createElement('h4');
                    nameElement.textContent = achievement.name;
                    
                    const descriptionElement = document.createElement('p');
                    descriptionElement.textContent = achievement.description;
                    
                    achievementInfo.appendChild(nameElement);
                    achievementInfo.appendChild(descriptionElement);
                    
                    // 成就状态
                    const achievementStatus = document.createElement('div');
                    achievementStatus.className = `achievement-status ${isUnlocked ? 'unlocked' : 'locked'}`;
                    achievementStatus.textContent = isUnlocked ? '已解锁' : '未解锁';
                    
                    achievementHeader.appendChild(achievementIcon);
                    achievementHeader.appendChild(achievementInfo);
                    achievementHeader.appendChild(achievementStatus);
                    
                    // 成就卡片内容
                    achievementCard.appendChild(achievementHeader);
                    
                    categoryGrid.appendChild(achievementCard);
                });
                
                categorySection.appendChild(categoryGrid);
                achievementsList.appendChild(categorySection);
            });
        }
    }
    
    // 渲染成就概览
    renderAchievementOverview(unlockedAchievementIds) {
        const achievementsList = document.getElementById('achievements-list');
        if (achievementsList) {
            const overviewSection = document.createElement('div');
            overviewSection.className = 'achievement-stats';
            
            const unlockedCount = unlockedAchievementIds.size;
            const totalCount = this.achievements.length;
            const progressPercentage = Math.round((unlockedCount / totalCount) * 100);
            const streakDays = this.getStreakDays();
            
            // 学习类成就
            const learningAchievements = this.achievements.filter(a => a.category === 'learning');
            const unlockedLearning = learningAchievements.filter(a => unlockedAchievementIds.has(a.id)).length;
            
            overviewSection.innerHTML = `
                <div class="achievement-stat-card">
                    <span class="stat-number">${totalCount}</span>
                    <span class="stat-label">总成就</span>
                </div>
                <div class="achievement-stat-card">
                    <span class="stat-number">${unlockedCount}</span>
                    <span class="stat-label">已解锁</span>
                </div>
                <div class="achievement-stat-card">
                    <span class="stat-number">${progressPercentage}%</span>
                    <span class="stat-label">完成率</span>
                </div>
                <div class="achievement-stat-card">
                    <span class="stat-number">${streakDays}</span>
                    <span class="stat-label">连续天数</span>
                </div>
            `;
            
            achievementsList.appendChild(overviewSection);
        }
    }
    
    // 获取连续学习天数
    getStreakDays() {
        const lastLearnedDate = localStorage.getItem('lastLearnedDate');
        if (!lastLearnedDate) return 0;
        
        const today = new Date();
        const lastDate = new Date(lastLearnedDate);
        const diffTime = Math.abs(today - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays === 1 ? parseInt(localStorage.getItem('streakDays') || '1') : 0;
    }
}

// 初始化奖励系统
const reward = new Reward();

// 导出reward实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = reward;
} else {
    window.reward = reward;
}
