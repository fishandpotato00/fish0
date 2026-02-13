class EnglishPractice {
    constructor() {
        this.currentTab = 'listening';
        this.currentAudioIndex = 0;
        this.listeningFiles = [];
        this.speakingFiles = [];
        this.init();
    }

    init() {
        this.setupTabs();
        this.loadAudioFiles();
        this.renderListeningFiles();
        this.renderSpeakingFiles();
    }

    // 设置标签页
    setupTabs() {
        const practiceTabs = document.querySelectorAll('.practice-tabs .tab-btn');
        const tabContents = document.querySelectorAll('#english-practice .tab-content');

        practiceTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // 更新标签按钮状态
                practiceTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // 更新内容显示
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
                
                // 更新当前标签
                this.currentTab = tabId;
                
                // 暂停音频
                if (this.audioElement && this.isPlaying) {
                    this.pauseAudio();
                }
            });
        });
    }

    // 加载音频文件
    loadAudioFiles() {
        // 听力文件
        this.listeningFiles = [
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

        // 口语文件
        this.speakingFiles = [
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
            '大一轮复习讲义（话题版）语境 34(1).mp3'
        ];
    }

    // 渲染听力文件列表
    renderListeningFiles() {
        const listeningFilesElement = document.getElementById('listening-files');
        if (listeningFilesElement) {
            let html = '<ul>';
            this.listeningFiles.forEach((file, index) => {
                html += `
                    <li data-index="${index}" data-file="${file}">
                        <span>${file}</span>
                        <button class="btn btn-sm btn-primary play-audio">播放</button>
                    </li>
                `;
            });
            html += '</ul>';
            listeningFilesElement.innerHTML = html;
            
            // 添加播放按钮事件
            this.addPlayButtonEvents('listening');
        }
    }

    // 渲染口语文件列表
    renderSpeakingFiles() {
        const speakingFilesElement = document.getElementById('speaking-files');
        if (speakingFilesElement) {
            let html = '<ul>';
            this.speakingFiles.forEach((file, index) => {
                html += `
                    <li data-index="${index}" data-file="${file}">
                        <span>${file}</span>
                        <button class="btn btn-sm btn-primary play-audio">播放</button>
                    </li>
                `;
            });
            html += '</ul>';
            speakingFilesElement.innerHTML = html;
            
            // 添加播放按钮事件
            this.addPlayButtonEvents('speaking');
        }
    }

    // 添加播放按钮事件
    addPlayButtonEvents(type) {
        const playButtons = document.querySelectorAll(`#${type}-files .play-audio`);
        playButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const li = btn.closest('li');
                const file = li.getAttribute('data-file');
                const index = parseInt(li.getAttribute('data-index'));
                
                this.playAudio(file, index, type);
            });
        });

        // 添加列表项点击事件
        const listItems = document.querySelectorAll(`#${type}-files li`);
        listItems.forEach(li => {
            li.addEventListener('click', () => {
                const file = li.getAttribute('data-file');
                const index = parseInt(li.getAttribute('data-index'));
                
                this.playAudio(file, index, type);
            });
        });
    }

    // 播放音频
    playAudio(file, index, type) {
        // 打开音频播放器
        main.openAudioPlayer();
        
        // 更新fun-learn的音频文件列表
        if (window.funLearn) {
            // 保存当前类型的文件列表
            if (type === 'listening') {
                window.funLearn.audioFiles = this.listeningFiles;
            } else if (type === 'speaking') {
                window.funLearn.audioFiles = this.speakingFiles;
            }
            
            // 更新当前音频索引
            window.funLearn.currentAudioIndex = index;
            
            // 加载并播放音频
            window.funLearn.loadAudio();
            window.funLearn.playAudio();
            
            // 更新音频列表
            window.funLearn.updateAudioList();
        }
        
        // 更新列表项选中状态
        this.updateListSelection(type, index);
    }

    // 暂停音频
    pauseAudio() {
        if (window.funLearn && window.funLearn.audioElement) {
            window.funLearn.pauseAudio();
        }
    }

    // 更新播放按钮状态
    updatePlayButtons() {
        // 播放按钮状态由蓝色播放器控制
    }

    // 更新列表选中状态
    updateListSelection(type, index) {
        const listItems = document.querySelectorAll(`#${type}-files li`);
        listItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

// 初始化英语练习
const englishPractice = new EnglishPractice();

// 导出实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = englishPractice;
} else {
    window.englishPractice = englishPractice;
}
