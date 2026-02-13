class VocabularyFilter {
    constructor() {
        this.vocabulary = null;
        this.filteredWords = [];
        this.currentFilters = {
            letter: null,
            search: '',
            partOfSpeech: null,
            difficulty: null
        };
        this.currentPage = 1;
        this.wordsPerPage = 20;
        this.isLoading = false;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.setupUI();
        this.setupEventListeners();
        this.loadVocabularyData();
        this.loadUserPreferences();
    }

    // 设置用户界面
    setupUI() {
        const vocabularyFilterSection = document.getElementById('vocabulary-filter');
        if (vocabularyFilterSection) {
            // 添加几何装饰元素
            this.addGeometricDecorations();
            // 增强筛选区域
            this.enhanceFilterSection();
            // 添加高级筛选选项
            this.addAdvancedFilters();
            // 添加结果排序选项
            this.addSortOptions();
            // 添加分页控件
            this.addPaginationControls();
        }
    }
    
    // 添加几何装饰元素
    addGeometricDecorations() {
        const vocabularyFilterContainer = document.querySelector('.vocabulary-filter-container');
        if (vocabularyFilterContainer) {
            // 创建装饰元素
            const decorations = [
                { className: 'geometric-decoration decoration-top-left' },
                { className: 'geometric-decoration decoration-top-right' },
                { className: 'geometric-decoration decoration-bottom-left' },
                { className: 'geometric-decoration decoration-bottom-right' }
            ];
            
            decorations.forEach(decoration => {
                const element = document.createElement('div');
                element.className = decoration.className;
                vocabularyFilterContainer.appendChild(element);
            });
        }
    }

    // 增强筛选区域
    enhanceFilterSection() {
        const letterFilterSection = document.querySelector('.letter-filter-section');
        if (letterFilterSection) {
            // 添加字母按钮容器的样式
            const letterButtons = document.getElementById('letter-buttons');
            if (letterButtons) {
                letterButtons.classList.add('letter-buttons-container');
                
                // 清空现有按钮，避免重复
                letterButtons.innerHTML = '';
                
                // 生成字母按钮
                const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let buttonsHtml = '';
                for (let letter of letters) {
                    buttonsHtml += `
                        <button class="btn letter-btn" data-letter="${letter}">
                            ${letter}
                        </button>
                    `;
                }
                letterButtons.innerHTML = buttonsHtml;
            }
        }

        // 增强搜索区域
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
            const searchBar = searchSection.querySelector('.search-bar');
            if (searchBar) {
                searchBar.classList.add('enhanced-search-bar');
                
                // 添加搜索建议容器
                const searchInput = document.getElementById('word-search-input');
                if (searchInput) {
                    const searchSuggestions = document.createElement('div');
                    searchSuggestions.id = 'search-suggestions';
                    searchSuggestions.classList.add('search-suggestions');
                    searchBar.appendChild(searchSuggestions);
                }
            }
        }

        // 增强结果显示区域
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            const filteredWords = document.getElementById('filtered-words');
            if (filteredWords) {
                filteredWords.classList.add('enhanced-filtered-words');
            }
        }
    }

    // 添加高级筛选选项
    addAdvancedFilters() {
        const vocabularyFilterContainer = document.querySelector('.vocabulary-filter-container');
        if (vocabularyFilterContainer) {
            // 创建高级筛选区域
            const advancedFilters = document.createElement('div');
            advancedFilters.className = 'advanced-filters';
            advancedFilters.innerHTML = `
                <h3 class="filter-title">高级筛选</h3>
                <div class="filter-options">
                    <div class="filter-group">
                        <label for="part-of-speech">词性</label>
                        <select id="part-of-speech" class="form-control">
                            <option value="">全部</option>
                            <option value="noun">名词</option>
                            <option value="verb">动词</option>
                            <option value="adjective">形容词</option>
                            <option value="adverb">副词</option>
                            <option value="preposition">介词</option>
                            <option value="conjunction">连词</option>
                            <option value="pronoun">代词</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="difficulty-level">难度级别</label>
                        <select id="difficulty-level" class="form-control">
                            <option value="">全部</option>
                            <option value="easy">简单</option>
                            <option value="medium">中等</option>
                            <option value="hard">困难</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <button class="btn btn-secondary" id="reset-filters">重置筛选</button>
                    </div>
                </div>
            `;
            
            // 插入到筛选区域之后
            const searchSection = document.querySelector('.search-section');
            if (searchSection) {
                vocabularyFilterContainer.insertBefore(advancedFilters, searchSection.nextSibling);
            }
        }
    }

    // 添加结果排序选项
    addSortOptions() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            // 创建排序选项
            const sortOptions = document.createElement('div');
            sortOptions.className = 'sort-options';
            sortOptions.innerHTML = `
                <div class="sort-group">
                    <label for="sort-by">排序方式</label>
                    <select id="sort-by" class="form-control">
                        <option value="word">按单词排序</option>
                        <option value="meaning">按释义排序</option>
                        <option value="length">按长度排序</option>
                    </select>
                </div>
            `;
            
            // 插入到结果标题之前
            const resultsTitle = resultsSection.querySelector('.results-title');
            if (resultsTitle) {
                resultsSection.insertBefore(sortOptions, resultsTitle);
            }
        }
    }

    // 添加分页控件
    addPaginationControls() {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            // 创建分页控件
            const pagination = document.createElement('div');
            pagination.className = 'pagination';
            pagination.innerHTML = `
                <button class="btn btn-sm btn-secondary" id="prev-page" disabled>
                    <i class="fas fa-chevron-left"></i> 上一页
                </button>
                <span class="page-info" id="page-info">第 1 页</span>
                <div class="page-input-container">
                    <input type="number" class="form-control form-control-sm page-input" id="page-input" min="1" value="1">
                    <button class="btn btn-sm btn-primary go-to-page" id="go-to-page">前往</button>
                </div>
                <button class="btn btn-sm btn-secondary" id="next-page" disabled>
                    下一页 <i class="fas fa-chevron-right"></i>
                </button>
            `;
            
            // 插入到结果容器之后
            const filteredWords = document.getElementById('filtered-words');
            if (filteredWords) {
                resultsSection.appendChild(pagination);
            }
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 字母按钮点击事件
        this.setupLetterButtonsListener();
        
        // 搜索功能事件
        this.setupSearchListeners();
        
        // 高级筛选事件
        this.setupAdvancedFilterListeners();
        
        // 排序事件
        this.setupSortListeners();
        
        // 分页事件
        this.setupPaginationListeners();
        
        // 音频播放事件
        this.setupAudioPlayListeners();
    }

    // 设置字母按钮监听器
    setupLetterButtonsListener() {
        const letterButtons = document.getElementById('letter-buttons');
        if (letterButtons) {
            console.log('Setting up letter buttons listener...');
            
            // 清除现有的事件监听器
            const newLetterButtons = letterButtons.cloneNode(true);
            letterButtons.parentNode.replaceChild(newLetterButtons, letterButtons);
            
            // 重新获取引用
            const updatedLetterButtons = document.getElementById('letter-buttons');
            
            if (updatedLetterButtons) {
                updatedLetterButtons.addEventListener('click', (e) => {
                    if (e.target.classList.contains('letter-btn')) {
                        const letter = e.target.getAttribute('data-letter');
                        console.log('Letter button clicked:', letter);
                        
                        // 更新当前筛选条件
                        this.currentFilters.letter = this.currentFilters.letter === letter ? null : letter;
                        this.currentFilters.search = '';
                        this.currentPage = 1;
                        console.log('Updated filters:', this.currentFilters);
                        
                        // 更新UI
                        this.updateLetterButtonsUI();
                        this.updateSearchInput();
                        this.applyFilters();
                    }
                });
                console.log('Letter buttons listener set up successfully');
            }
        } else {
            console.warn('Letter buttons container not found');
        }
    }

    // 设置搜索监听器
    setupSearchListeners() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('word-search-input');
        
        console.log('Setting up search listeners...');
        console.log('Search button:', searchBtn);
        console.log('Search input:', searchInput);
        
        if (searchBtn && searchInput) {
            // 先移除现有的事件监听器（如果存在）
            const newSearchBtn = searchBtn.cloneNode(true);
            searchBtn.parentNode.replaceChild(newSearchBtn, searchBtn);
            const updatedSearchBtn = document.getElementById('search-btn');
            
            // 搜索按钮点击事件
            updatedSearchBtn.addEventListener('click', () => {
                console.log('Search button clicked');
                this.performSearch(searchInput.value);
            });
            
            // 回车键搜索
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    console.log('Enter key pressed');
                    this.performSearch(searchInput.value);
                }
            });
            
            // 输入事件（仅用于搜索建议，不自动执行搜索）
            searchInput.addEventListener('input', (e) => {
                const value = e.target.value;
                console.log('Input value changed:', value);
                
                // 清除之前的超时
                if (this.searchTimeout) {
                    clearTimeout(this.searchTimeout);
                }
                
                // 显示搜索建议
                this.showSearchSuggestions(value);
            });
            
            // 点击外部关闭搜索建议
            document.addEventListener('click', (e) => {
                const searchSuggestions = document.getElementById('search-suggestions');
                const searchBar = document.querySelector('.search-bar');
                if (searchSuggestions && !searchBar.contains(e.target)) {
                    searchSuggestions.innerHTML = '';
                }
            });
            
            console.log('Search listeners set up successfully');
        } else {
            console.warn('Search button or input not found');
        }
    }

    // 设置高级筛选监听器
    setupAdvancedFilterListeners() {
        const partOfSpeech = document.getElementById('part-of-speech');
        const difficultyLevel = document.getElementById('difficulty-level');
        const resetFilters = document.getElementById('reset-filters');
        
        if (partOfSpeech) {
            partOfSpeech.addEventListener('change', (e) => {
                this.currentFilters.partOfSpeech = e.target.value || null;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (difficultyLevel) {
            difficultyLevel.addEventListener('change', (e) => {
                this.currentFilters.difficulty = e.target.value || null;
                this.currentPage = 1;
                this.applyFilters();
            });
        }
        
        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                this.resetFilters();
            });
        }
    }

    // 设置排序监听器
    setupSortListeners() {
        const sortBy = document.getElementById('sort-by');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.sortWords(e.target.value);
            });
        }
    }

    // 设置分页监听器
    setupPaginationListeners() {
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        const pageInput = document.getElementById('page-input');
        const goToPageBtn = document.getElementById('go-to-page');
        
        if (prevPage) {
            prevPage.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderFilteredWords();
                    this.updatePagination();
                }
            });
        }
        
        if (nextPage) {
            nextPage.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredWords.length / this.wordsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderFilteredWords();
                    this.updatePagination();
                }
            });
        }
        
        if (pageInput && goToPageBtn) {
            // 前往按钮点击事件
            goToPageBtn.addEventListener('click', () => {
                const pageNum = parseInt(pageInput.value);
                const totalPages = Math.ceil(this.filteredWords.length / this.wordsPerPage);
                if (pageNum >= 1 && pageNum <= totalPages) {
                    this.currentPage = pageNum;
                    this.renderFilteredWords();
                    this.updatePagination();
                } else {
                    alert(`请输入有效的页码（1-${totalPages}）`);
                    pageInput.value = this.currentPage;
                }
            });
            
            // 页码输入框回车键事件
            pageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const pageNum = parseInt(pageInput.value);
                    const totalPages = Math.ceil(this.filteredWords.length / this.wordsPerPage);
                    if (pageNum >= 1 && pageNum <= totalPages) {
                        this.currentPage = pageNum;
                        this.renderFilteredWords();
                        this.updatePagination();
                    } else {
                        alert(`请输入有效的页码（1-${totalPages}）`);
                        pageInput.value = this.currentPage;
                    }
                }
            });
        }
    }

    // 设置音频播放监听器
    setupAudioPlayListeners() {
        // 使用事件委托，将事件监听器添加到父元素上
        const vocabularyFilterSection = document.getElementById('vocabulary-filter');
        if (vocabularyFilterSection) {
            vocabularyFilterSection.addEventListener('click', (e) => {
                if (e.target.closest('.play-audio') || e.target.closest('.play-audio-btn')) {
                    const button = e.target.closest('.play-audio') || e.target.closest('.play-audio-btn');
                    const word = button.getAttribute('data-word');
                    if (word) {
                        this.playWordAudio(word);
                    }
                }
            });
        }
    }

    // 加载词汇数据
    loadVocabularyData() {
        this.isLoading = true;
        this.showLoadingState();
        
        // 尝试加载词汇数据
        const loadData = () => {
            if (typeof vocabulary3500 !== 'undefined') {
                this.vocabulary = vocabulary3500;
                // 为单词添加词性
                this.addPartOfSpeechToWords();
                this.isLoading = false;
                this.hideLoadingState();
                this.saveVocabularyToCache();
                console.log('3500 Vocabulary data loaded successfully');
            } else if (typeof vocabulary !== 'undefined') {
                this.vocabulary = vocabulary;
                // 为单词添加词性
                this.addPartOfSpeechToWords();
                this.isLoading = false;
                this.hideLoadingState();
                this.saveVocabularyToCache();
                console.log('Vocabulary data loaded successfully');
            } else {
                // 尝试从缓存加载
                this.loadVocabularyFromCache();
                
                // 如果缓存也没有，等待一段时间后重试
                setTimeout(loadData, 100);
            }
        };
        
        loadData();
    }

    // 从缓存加载词汇数据
    loadVocabularyFromCache() {
        try {
            const cachedVocabulary = localStorage.getItem('cachedVocabulary');
            if (cachedVocabulary) {
                this.vocabulary = JSON.parse(cachedVocabulary);
                this.isLoading = false;
                this.hideLoadingState();
                console.log('Vocabulary data loaded from cache');
            }
        } catch (error) {
            console.error('Error loading vocabulary from cache:', error);
        }
    }

    // 保存词汇数据到缓存
    saveVocabularyToCache() {
        try {
            localStorage.setItem('cachedVocabulary', JSON.stringify(this.vocabulary));
        } catch (error) {
            console.error('Error saving vocabulary to cache:', error);
        }
    }

    // 加载用户偏好设置
    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem('vocabularyFilterPreferences');
            if (preferences) {
                const savedPrefs = JSON.parse(preferences);
                this.currentFilters = { ...this.currentFilters, ...savedPrefs.filters };
                this.wordsPerPage = savedPrefs.wordsPerPage || this.wordsPerPage;
                
                // 更新UI
                this.updateFilterUI();
            }
        } catch (error) {
            console.error('Error loading user preferences:', error);
        }
    }

    // 保存用户偏好设置
    saveUserPreferences() {
        try {
            const preferences = {
                filters: this.currentFilters,
                wordsPerPage: this.wordsPerPage
            };
            localStorage.setItem('vocabularyFilterPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving user preferences:', error);
        }
    }

    // 执行搜索
    performSearch(keyword) {
        const searchTerm = keyword.trim().toLowerCase();
        
        // 更新当前筛选条件
        this.currentFilters.search = searchTerm;
        this.currentFilters.letter = null;
        this.currentPage = 1;
        
        // 更新UI
        this.updateLetterButtonsUI();
        
        // 检查是否是罗小黑彩蛋
        if (searchTerm === '罗小黑') {
            this.showLuoXiaoHeiEasterEgg();
        }
        
        // 应用筛选
        this.applyFilters();
        
        // 保存用户偏好
        this.saveUserPreferences();
    }
    
    // 优化搜索建议显示
    showSearchSuggestions(value) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (!searchSuggestions || !this.vocabulary) {
            if (searchSuggestions) searchSuggestions.innerHTML = '';
            return;
        }
        
        // 如果输入为空，显示所有单词
        if (!value) {
            searchSuggestions.innerHTML = '';
            return;
        }
        
        // 生成搜索建议
        const suggestions = this.vocabulary.words
            .filter(word => 
                word.word.toLowerCase().startsWith(value.toLowerCase()) ||
                word.meaning.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 10); // 显示更多建议
        
        // 生成建议HTML
        let suggestionsHtml = '';
        if (suggestions.length > 0) {
            suggestionsHtml = suggestions.map(word => `
                <div class="search-suggestion-item" data-word="${word.word}">
                    <strong>${word.word}</strong>
                    <span>${word.meaning}</span>
                    ${word.partOfSpeech ? `<small class="suggestion-pos">${word.partOfSpeech}</small>` : ''}
                </div>
            `).join('');
        }
        
        // 更新建议容器
        searchSuggestions.innerHTML = suggestionsHtml;
        
        // 添加建议点击事件
        searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const word = item.getAttribute('data-word');
                const searchInput = document.getElementById('word-search-input');
                if (searchInput) {
                    searchInput.value = word;
                    this.performSearch(word);
                }
                searchSuggestions.innerHTML = '';
            });
        });
    }

    // 优化搜索性能的方法
    optimizeSearch() {
        // 为词汇数据创建索引，提高搜索速度
        if (this.vocabulary && !this.vocabulary.searchIndex) {
            console.log('Creating search index...');
            
            // 检查是否有缓存的索引
            const cachedIndex = localStorage.getItem('vocabularySearchIndex');
            if (cachedIndex) {
                try {
                    this.vocabulary.searchIndex = JSON.parse(cachedIndex);
                    console.log('Search index loaded from cache');
                    return;
                } catch (error) {
                    console.error('Error loading search index from cache:', error);
                }
            }
            
            // 优化索引结构，减少内存使用
            this.vocabulary.searchIndex = {
                words: {}, // 单词前缀索引
                firstLetters: {}, // 首字母索引
                partOfSpeech: {} // 词性索引
            };
            
            // 构建索引
            this.vocabulary.words.forEach((word, index) => {
                // 单词索引 - 前缀和完整单词
                const wordLower = word.word.toLowerCase();
                for (let i = 1; i <= wordLower.length; i++) {
                    const prefix = wordLower.substring(0, i);
                    if (!this.vocabulary.searchIndex.words[prefix]) {
                        this.vocabulary.searchIndex.words[prefix] = [];
                    }
                    this.vocabulary.searchIndex.words[prefix].push(index);
                }
                
                // 首字母索引
                const firstLetter = word.word.charAt(0).toUpperCase();
                if (!this.vocabulary.searchIndex.firstLetters[firstLetter]) {
                    this.vocabulary.searchIndex.firstLetters[firstLetter] = [];
                }
                this.vocabulary.searchIndex.firstLetters[firstLetter].push(index);
                
                // 词性索引
                if (word.partOfSpeech) {
                    if (!this.vocabulary.searchIndex.partOfSpeech[word.partOfSpeech]) {
                        this.vocabulary.searchIndex.partOfSpeech[word.partOfSpeech] = [];
                    }
                    this.vocabulary.searchIndex.partOfSpeech[word.partOfSpeech].push(index);
                }
            });
            
            // 统计a、b开头的单词数量
            const aCount = this.vocabulary.searchIndex.firstLetters['A'] ? this.vocabulary.searchIndex.firstLetters['A'].length : 0;
            const bCount = this.vocabulary.searchIndex.firstLetters['B'] ? this.vocabulary.searchIndex.firstLetters['B'].length : 0;
            console.log('搜索索引创建完成，包含', Object.keys(this.vocabulary.searchIndex.words).length, '个单词前缀索引');
            console.log('A开头单词数量:', aCount);
            console.log('B开头单词数量:', bCount);
            console.log('词性索引包含:', Object.keys(this.vocabulary.searchIndex.partOfSpeech).length, '种词性');
            
            // 缓存索引
            try {
                localStorage.setItem('vocabularySearchIndex', JSON.stringify(this.vocabulary.searchIndex));
                console.log('Search index cached');
            } catch (error) {
                console.error('Error caching search index:', error);
            }
        }
    }

    // 应用筛选
    applyFilters() {
        if (!this.vocabulary) {
            this.showLoadingState();
            return;
        }
        
        // 确保搜索索引已创建
        this.optimizeSearch();
        
        this.isLoading = true;
        this.showLoadingState();
        
        // 生成筛选缓存键
        const filterKey = JSON.stringify(this.currentFilters);
        
        // 对于首字母筛选，不使用缓存，确保每次都能获取最新结果
        if (this.currentFilters.letter) {
            console.log('Clearing cache for letter filter to ensure fresh results');
            this.performOptimizedFiltering(filterKey);
        } else {
            // 检查缓存
            const cachedResults = this.getFilteredResultsFromCache(filterKey);
            if (cachedResults) {
                this.filteredWords = cachedResults;
                this.processFilteredResults();
                return;
            }
            
            // 使用优化的筛选方法
            this.performOptimizedFiltering(filterKey);
        }
    }

    // 执行优化的筛选
    performOptimizedFiltering(filterKey) {
        // 开始时间（用于性能测试）
        const startTime = performance.now();
        
        let results = [...this.vocabulary.words];
        
        // 应用首字母筛选
        if (this.currentFilters.letter) {
            console.log('Applying letter filter:', this.currentFilters.letter);
            
            // 传统筛选方法（确保能找到所有匹配的单词）
            console.log('Using traditional filtering for letter filter');
            console.log('Total words before filtering:', results.length);
            const filtered = results.filter(word => {
                if (!word || !word.word) return false;
                const firstChar = word.word.charAt(0).toUpperCase();
                const match = firstChar === this.currentFilters.letter;
                if (match) {
                    console.log('Found matching word:', word.word);
                }
                return match;
            });
            console.log(`Letter filter results (traditional): ${filtered.length} words`);
            results = filtered;
        }
        
        // 应用搜索筛选（使用索引提高速度）
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            console.log('Performing search for:', searchTerm);
            
            // 检查缓存
            const searchCacheKey = `search_${searchTerm}`;
            const cachedSearchResults = this.getFilteredResultsFromCache(searchCacheKey);
            if (cachedSearchResults) {
                console.log('Using cached search results');
                results = cachedSearchResults;
            } else {
                // 使用优化的搜索策略
                const matchedIndices = new Set();
                
                // 1. 优先使用单词前缀索引（最快）
                if (this.vocabulary.searchIndex) {
                    console.log('Using optimized search strategy');
                    
                    // 检查是否有精确匹配的前缀
                    if (this.vocabulary.searchIndex.words[searchTerm]) {
                        console.log('Found exact prefix match');
                        this.vocabulary.searchIndex.words[searchTerm].forEach(index => {
                            matchedIndices.add(index);
                        });
                    }
                    
                    // 2. 如果没有精确匹配，进行模糊搜索
                    if (matchedIndices.size === 0 && searchTerm.length > 1) {
                        console.log('Performing fuzzy search');
                        // 快速模糊搜索 - 只检查单词前缀
                        let checkedKeys = 0;
                        const maxCheckedKeys = 500; // 进一步限制搜索范围以提高速度
                        
                        for (const wordKey in this.vocabulary.searchIndex.words) {
                            if (checkedKeys >= maxCheckedKeys) break;
                            if (wordKey.includes(searchTerm)) {
                                this.vocabulary.searchIndex.words[wordKey].forEach(index => {
                                    matchedIndices.add(index);
                                });
                                checkedKeys++;
                            }
                        }
                    }
                }
                
                // 3. 如果索引搜索失败，使用传统搜索方法作为最后手段
                if (matchedIndices.size === 0) {
                    console.log('Using traditional search as fallback');
                    results = results.filter(word => 
                        word.word.toLowerCase().includes(searchTerm) ||
                        word.meaning.toLowerCase().includes(searchTerm) ||
                        (word.example && word.example.toLowerCase().includes(searchTerm))
                    );
                } else {
                    // 使用索引结果
                    console.log(`Found ${matchedIndices.size} matches using index`);
                    results = results.filter((word, index) => matchedIndices.has(index));
                }
                
                // 缓存搜索结果
                this.saveFilteredResultsToCache(searchCacheKey, results);
            }
            console.log(`Search results: ${results.length} words`);
        }
        
        // 应用词性筛选
        if (this.currentFilters.partOfSpeech) {
            console.log('Applying part of speech filter:', this.currentFilters.partOfSpeech);
            
            // 使用词性索引进行快速筛选
            if (this.vocabulary.searchIndex && this.vocabulary.searchIndex.partOfSpeech[this.currentFilters.partOfSpeech]) {
                console.log('Using partOfSpeech index for filtering');
                const matchedIndices = this.vocabulary.searchIndex.partOfSpeech[this.currentFilters.partOfSpeech];
                results = matchedIndices.map(index => this.vocabulary.words[index]);
                console.log(`Part of speech filter results (from index): ${results.length} words`);
            } else {
                // 传统筛选方法作为备用
                console.log('Using traditional filtering for part of speech');
                results = results.filter(word => 
                    word.partOfSpeech === this.currentFilters.partOfSpeech
                );
                console.log(`Part of speech filter results (traditional): ${results.length} words`);
            }
        }
        
        // 应用难度筛选
        if (this.currentFilters.difficulty) {
            results = results.filter(word => 
                word.difficulty === this.currentFilters.difficulty
            );
        }
        
        // 保存筛选结果
        this.filteredWords = results;
        this.saveFilteredResultsToCache(filterKey, results);
        
        // 排序
        this.sortWords(document.getElementById('sort-by')?.value || 'word');
        
        // 渲染结果
        this.renderFilteredWords();
        
        // 更新分页
        this.updatePagination();
        
        // 隐藏加载状态
        this.isLoading = false;
        this.hideLoadingState();
        
        // 保存用户偏好
        this.saveUserPreferences();
        
        // 检查是否触发成就
        this.checkForAchievements();
        
        // 性能测试
        const endTime = performance.now();
        console.log(`筛选耗时: ${(endTime - startTime).toFixed(2)}ms`);
    }

    // 从缓存获取筛选结果
    getFilteredResultsFromCache(filterKey) {
        try {
            const cached = localStorage.getItem(`filteredResults_${filterKey}`);
            return cached ? JSON.parse(cached) : null;
        } catch (error) {
            console.error('Error getting cached results:', error);
            return null;
        }
    }

    // 保存筛选结果到缓存
    saveFilteredResultsToCache(filterKey, results) {
        try {
            localStorage.setItem(`filteredResults_${filterKey}`, JSON.stringify(results));
        } catch (error) {
            console.error('Error saving cached results:', error);
        }
    }

    // 使用Web Worker进行筛选
    useWebWorkerForFiltering(filterKey) {
        try {
            // 创建内联Worker
            const workerCode = `
                self.onmessage = function(e) {
                    const { vocabulary, filters } = e.data;
                    let results = [...vocabulary.words];
                    
                    // 应用首字母筛选
                    if (filters.letter) {
                        results = results.filter(word => 
                            word.word.charAt(0).toUpperCase() === filters.letter
                        );
                    }
                    
                    // 应用搜索筛选
                    if (filters.search) {
                        const searchTerm = filters.search;
                        results = results.filter(word => 
                            word.word.toLowerCase().includes(searchTerm) ||
                            word.meaning.toLowerCase().includes(searchTerm) ||
                            (word.example && word.example.toLowerCase().includes(searchTerm))
                        );
                    }
                    
                    // 应用词性筛选
                    if (filters.partOfSpeech) {
                        results = results.filter(word => 
                            word.partOfSpeech === filters.partOfSpeech
                        );
                    }
                    
                    // 应用难度筛选
                    if (filters.difficulty) {
                        results = results.filter(word => 
                            word.difficulty === filters.difficulty
                        );
                    }
                    
                    self.postMessage(results);
                };
            `;
            
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const worker = new Worker(URL.createObjectURL(blob));
            
            worker.onmessage = (e) => {
                this.filteredWords = e.data;
                this.saveFilteredResultsToCache(filterKey, e.data);
                this.processFilteredResults();
                worker.terminate();
            };
            
            worker.onerror = (error) => {
                console.error('Worker error:', error);
                worker.terminate();
                // 降级到同步筛选
                this.performFilteringSync(filterKey);
            };
            
            // 发送数据到Worker
            worker.postMessage({
                vocabulary: this.vocabulary,
                filters: this.currentFilters
            });
        } catch (error) {
            console.error('Error creating worker:', error);
            // 降级到同步筛选
            this.performFilteringSync(filterKey);
        }
    }

    // 同步执行筛选
    performFilteringSync(filterKey) {
        let results = [...this.vocabulary.words];
        
        // 应用首字母筛选
        if (this.currentFilters.letter) {
            results = results.filter(word => 
                word.word.charAt(0).toUpperCase() === this.currentFilters.letter
            );
        }
        
        // 应用搜索筛选
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search;
            results = results.filter(word => 
                word.word.toLowerCase().includes(searchTerm) ||
                word.meaning.toLowerCase().includes(searchTerm) ||
                (word.example && word.example.toLowerCase().includes(searchTerm))
            );
        }
        
        // 应用词性筛选
        if (this.currentFilters.partOfSpeech) {
            results = results.filter(word => 
                word.partOfSpeech === this.currentFilters.partOfSpeech
            );
        }
        
        // 应用难度筛选
        if (this.currentFilters.difficulty) {
            results = results.filter(word => 
                word.difficulty === this.currentFilters.difficulty
            );
        }
        
        // 保存筛选结果
        this.filteredWords = results;
        this.saveFilteredResultsToCache(filterKey, results);
        this.processFilteredResults();
    }

    // 处理筛选结果
    processFilteredResults() {
        // 排序
        this.sortWords(document.getElementById('sort-by')?.value || 'word');
        
        // 渲染结果
        this.renderFilteredWords();
        
        // 更新分页
        this.updatePagination();
        
        // 隐藏加载状态
        this.isLoading = false;
        this.hideLoadingState();
        
        // 保存用户偏好
        this.saveUserPreferences();
        
        // 检查是否触发成就
        this.checkForAchievements();
    }

    // 排序单词
    sortWords(sortBy) {
        switch (sortBy) {
            case 'word':
                this.filteredWords.sort((a, b) => a.word.localeCompare(b.word));
                break;
            case 'meaning':
                this.filteredWords.sort((a, b) => a.meaning.localeCompare(b.meaning));
                break;
            case 'length':
                this.filteredWords.sort((a, b) => a.word.length - b.word.length);
                break;
        }
        
        this.renderFilteredWords();
    }

    // 渲染筛选后的单词
    renderFilteredWords() {
        const filteredWordsContainer = document.getElementById('filtered-words');
        if (!filteredWordsContainer) return;
        
        // 计算当前页的单词
        const startIndex = (this.currentPage - 1) * this.wordsPerPage;
        const endIndex = startIndex + this.wordsPerPage;
        const currentPageWords = this.filteredWords.slice(startIndex, endIndex);
        
        // 生成结果HTML
        let resultHtml = '';
        
        if (this.currentFilters.letter) {
            resultHtml += `<h5>${this.currentFilters.letter}开头的单词</h5>`;
        } else if (this.currentFilters.search) {
            resultHtml += `<h5>搜索结果: "${this.currentFilters.search}"</h5>`;
        } else {
            resultHtml += '<h5>全部单词</h5>';
        }
        
        resultHtml += `<div class="filtered-words-list">`;
        
        if (currentPageWords.length > 0) {
            resultHtml += currentPageWords.map(word => this.generateWordCard(word)).join('');
        } else {
            resultHtml += `<div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h6>未找到匹配的单词</h6>
                <p>尝试调整筛选条件或搜索词</p>
            </div>`;
        }
        
        resultHtml += `</div>`;
        
        // 更新结果容器
        filteredWordsContainer.innerHTML = resultHtml;
        
        // 添加动画效果
        this.addWordCardAnimations();
    }

    // 生成单词卡片
    generateWordCard(word) {
        return `
            <div class="filtered-word-item word-card">
                <div class="word-card-header">
                    <div class="word-info">
                        <h6 class="word">${word.word}</h6>
                        ${word.phonetic ? `<p class="phonetic">${word.phonetic}</p>` : ''}
                    </div>
                </div>
                <div class="word-card-body">
                    <p class="meaning">${word.meaning}</p>
                    ${word.example ? `
                        <div class="example">
                            <small>${word.example}</small>
                        </div>
                    ` : ''}
                    ${word.partOfSpeech ? `
                        <div class="pos-tag">
                            <span class="pos-text">${word.partOfSpeech}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="word-actions">
                    <button class="play-audio" data-word="${word.word}">
                        <i class="fas fa-volume-up"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // 更新分页控件
    updatePagination() {
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        const pageInfo = document.getElementById('page-info');
        const pageInput = document.getElementById('page-input');
        
        if (prevPage && nextPage && pageInfo) {
            const totalPages = Math.ceil(this.filteredWords.length / this.wordsPerPage);
            
            // 更新按钮状态
            prevPage.disabled = this.currentPage === 1;
            nextPage.disabled = this.currentPage === totalPages || totalPages === 0;
            
            // 更新页面信息
            pageInfo.textContent = `第 ${this.currentPage} / ${totalPages} 页 (共 ${this.filteredWords.length} 个单词)`;
            
            // 更新页码输入框
            if (pageInput) {
                pageInput.value = this.currentPage;
                pageInput.max = totalPages;
            }
        }
    }

    // 显示搜索建议
    showSearchSuggestions(value) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (!searchSuggestions || !value || !this.vocabulary) {
            if (searchSuggestions) searchSuggestions.innerHTML = '';
            return;
        }
        
        // 生成搜索建议
        const suggestions = this.vocabulary.words
            .filter(word => 
                word.word.toLowerCase().startsWith(value.toLowerCase()) ||
                word.meaning.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, 5);
        
        // 生成建议HTML
        let suggestionsHtml = '';
        if (suggestions.length > 0) {
            suggestionsHtml = suggestions.map(word => `
                <div class="search-suggestion-item" data-word="${word.word}">
                    <strong>${word.word}</strong>
                    <span>${word.meaning}</span>
                </div>
            `).join('');
        }
        
        // 更新建议容器
        searchSuggestions.innerHTML = suggestionsHtml;
        
        // 添加建议点击事件
        searchSuggestions.querySelectorAll('.search-suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const word = item.getAttribute('data-word');
                const searchInput = document.getElementById('word-search-input');
                if (searchInput) {
                    searchInput.value = word;
                    this.performSearch(word);
                }
                searchSuggestions.innerHTML = '';
            });
        });
    }

    // 重置筛选
    resetFilters() {
        // 重置筛选条件
        this.currentFilters = {
            letter: null,
            search: '',
            partOfSpeech: null,
            difficulty: null
        };
        
        this.currentPage = 1;
        
        // 更新UI
        this.updateFilterUI();
        this.updateLetterButtonsUI();
        this.updateSearchInput();
        
        // 应用筛选
        this.applyFilters();
        
        // 保存用户偏好
        this.saveUserPreferences();
    }

    // 更新筛选UI
    updateFilterUI() {
        const partOfSpeech = document.getElementById('part-of-speech');
        const difficultyLevel = document.getElementById('difficulty-level');
        
        if (partOfSpeech) {
            partOfSpeech.value = this.currentFilters.partOfSpeech || '';
        }
        
        if (difficultyLevel) {
            difficultyLevel.value = this.currentFilters.difficulty || '';
        }
    }

    // 更新字母按钮UI
    updateLetterButtonsUI() {
        const letterButtons = document.querySelectorAll('.letter-btn');
        letterButtons.forEach(btn => {
            const letter = btn.getAttribute('data-letter');
            if (letter === this.currentFilters.letter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // 更新搜索输入
    updateSearchInput() {
        const searchInput = document.getElementById('word-search-input');
        if (searchInput) {
            searchInput.value = this.currentFilters.search;
        }
    }

    // 显示加载状态
    showLoadingState() {
        const filteredWordsContainer = document.getElementById('filtered-words');
        if (filteredWordsContainer) {
            filteredWordsContainer.innerHTML = `
                <div class="loading-state">
                    <div class="loading-spinner"></div>
                    <p>加载中...</p>
                </div>
            `;
        }
    }

    // 隐藏加载状态
    hideLoadingState() {
        // 加载状态会在renderFilteredWords中被替换
    }

    // 添加单词卡片动画
    addWordCardAnimations() {
        const wordCards = document.querySelectorAll('.word-card');
        wordCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            }, index * 50);
        });
    }

    // 播放单词音频
    playWordAudio(word) {
        if ('speechSynthesis' in window) {
            try {
                // 先暂停之前的音频
                speechSynthesis.cancel();
                
                // 创建新的语音实例
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                utterance.pitch = 1;
                utterance.volume = 1;
                
                // 播放音频
                speechSynthesis.speak(utterance);
            } catch (error) {
                console.error('Error playing audio:', error);
                alert('音频播放失败，请检查浏览器设置');
            }
        } else {
            alert('您的浏览器不支持语音合成功能');
        }
    }

    // 显示罗小黑彩蛋
    showLuoXiaoHeiEasterEgg() {
        // 检查是否是第一次开启彩蛋
        const firstTime = !localStorage.getItem('hasSeenLuoXiaoHeiEasterEgg');
        
        // 标记已开启彩蛋
        localStorage.setItem('hasSeenLuoXiaoHeiEasterEgg', 'true');
        
        // 创建背景遮罩
        const overlay = document.createElement('div');
        overlay.id = 'easter-egg-overlay';
        overlay.classList.add('easter-egg-overlay');
        
        // 创建彩蛋容器
        const easterEggContainer = document.createElement('div');
        easterEggContainer.id = 'luo-xiao-hei-easter-egg';
        easterEggContainer.classList.add('easter-egg-container');
        
        // 创建发光效果
        const glowEffect = document.createElement('div');
        glowEffect.classList.add('easter-egg-glow');
        easterEggContainer.appendChild(glowEffect);
        
        // 创建图片元素
        const img = document.createElement('img');
        
        // 直接使用正确的图片路径
        const imagePath = '彩蛋/罗小黑/20200402130159_gprlx.gif';
        img.src = imagePath;
        img.alt = '罗小黑';
        img.classList.add('easter-egg-image');
        img.style.maxWidth = '400px';
        img.style.maxHeight = '400px';
        
        // 图片加载失败时的处理
        img.onerror = function() {
            this.style.display = 'none';
            const errorText = document.createElement('p');
            errorText.textContent = '罗小黑图片加载失败，但彩蛋触发成功！';
            errorText.classList.add('easter-egg-error');
            easterEggContainer.appendChild(errorText);
        };
        
        // 添加图片到容器
        easterEggContainer.appendChild(img);
        
        // 添加彩蛋文本
        const easterEggText = document.createElement('div');
        easterEggText.classList.add('easter-egg-text');
        easterEggText.textContent = '恭喜发现罗小黑彩蛋！';
        easterEggContainer.appendChild(easterEggText);
        
        // 添加解锁信息
        const unlockInfo = document.createElement('div');
        unlockInfo.classList.add('easter-egg-unlock');
        unlockInfo.innerHTML = `
            <div class="unlock-icon">
                <i class="fas fa-star"></i>
            </div>
            <p>你解锁了罗小黑成就！</p>
        `;
        easterEggContainer.appendChild(unlockInfo);
        
        // 添加按钮
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('easter-egg-buttons');
        
        // 关闭彩蛋的函数
        const closeEasterEgg = () => {
            try {
                // 直接通过ID查找元素并移除
                const overlayElement = document.getElementById('easter-egg-overlay');
                const containerElement = document.getElementById('luo-xiao-hei-easter-egg');
                
                if (overlayElement && document.body.contains(overlayElement)) {
                    document.body.removeChild(overlayElement);
                }
                if (containerElement && document.body.contains(containerElement)) {
                    document.body.removeChild(containerElement);
                }
                
                console.log('Easter egg closed successfully');
            } catch (error) {
                console.error('Error closing easter egg:', error);
            }
        };
        
        // 查看成就按钮
        const achievementButton = document.createElement('button');
        achievementButton.classList.add('btn', 'easter-egg-achievement');
        achievementButton.textContent = '查看成就';
        achievementButton.addEventListener('click', () => {
            // 跳转到成就页面
            window.location.hash = '#reward';
            
            // 关闭彩蛋
            closeEasterEgg();
        });
        
        // 关闭按钮
        const closeButton = document.createElement('button');
        closeButton.classList.add('btn', 'easter-egg-close');
        closeButton.textContent = '关闭';
        closeButton.addEventListener('click', closeEasterEgg);
        
        buttonContainer.appendChild(achievementButton);
        buttonContainer.appendChild(closeButton);
        easterEggContainer.appendChild(buttonContainer);
        
        // 添加到页面
        document.body.appendChild(overlay);
        document.body.appendChild(easterEggContainer);
        
        // 添加显示动画
        setTimeout(() => {
            overlay.classList.add('show');
            easterEggContainer.classList.add('show');
        }, 100);
        
        // 点击遮罩关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeEasterEgg();
            }
        });
        
        // 添加ESC键关闭功能
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeEasterEgg();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
        
        // 触发成就
        this.triggerAchievement('luo-xiao-hei');
    }
    
    // 触发成就
    triggerAchievement(achievementId) {
        // 保存成就解锁状态
        const achievements = JSON.parse(localStorage.getItem('achievements') || '{}');
        achievements[achievementId] = true;
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        console.log('成就触发:', achievementId);
    }
    
    // 确保筛选功能正常工作
    ensureFilteringWorks() {
        // 确保字母筛选功能正常
        console.log('确保字母筛选功能正常...');
        
        // 确保搜索功能正常
        console.log('确保搜索功能正常...');
        
        // 确保词性筛选功能正常
        console.log('确保词性筛选功能正常...');
    }
    
    // 为单词添加词性
    addPartOfSpeechToWords() {
        // 为所有单词添加词性信息，默认为noun
        this.vocabulary.words.forEach(word => {
            if (!word.partOfSpeech) {
                word.partOfSpeech = 'noun';
            }
            // 添加难度级别
            if (!word.difficulty) {
                word.difficulty = word.word.length <= 4 ? 'easy' : word.word.length <= 7 ? 'medium' : 'hard';
            }
        });
        
        // 保存更新后的词汇数据
        this.saveVocabularyToCache();
        console.log('Added part of speech to all words');
    }
}

// 添加重置账号的全局函数
window.resetAccount = function() {
    if (confirm('确定要重置账号到初始状态吗？此操作将清除所有学习进度和成就！')) {
        // 清除本地存储
        const keysToRemove = [
            'userData',
            'cachedVocabulary',
            'vocabularyFilterPreferences',
            'hasSeenLuoXiaoHeiEasterEgg',
            'filterCount',
            'searchCount',
            'currentWordIndex',
            'vocabularyPoints',
            'unknownWords',
            'wordMemoryStrength',
            'learningGoal',
            'reviewInterval',
            'difficultyLevel',
            'achievements'
        ];
        
        // 清除匹配的键
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (keysToRemove.includes(key) || key.startsWith('filteredResults_')) {
                localStorage.removeItem(key);
                i--; // 调整索引
            }
        }
        
        // 刷新页面
        location.reload();
    }
};

// 为奖励中心添加彩蛋成就分支和雾效
(function() {
    // 当奖励中心加载时添加雾效
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.id === 'reward' && node.classList.contains('section')) {
                    // 检查是否已解锁彩蛋成就
                    const hasUnlockedEasterEgg = localStorage.getItem('hasSeenLuoXiaoHeiEasterEgg');
                    
                    // 如果未解锁，添加雾效
                    if (!hasUnlockedEasterEgg) {
                        addFogEffectToRewards();
                    }
                }
            });
        });
    });
    
    // 开始观察
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 添加雾效到奖励中心
    function addFogEffectToRewards() {
        const rewardSection = document.getElementById('reward');
        if (!rewardSection) return;
        
        // 确保奖励中心有相对定位
        rewardSection.style.position = 'relative';
        
        // 创建雾效容器
        const fog = document.createElement('div');
        fog.className = 'achievement-fog';
        fog.innerHTML = `
            <div class="fog-content">
                <div class="fog-icon">🔍</div>
                <h3 class="fog-title">探索彩蛋</h3>
                <p class="fog-description">
                    在词汇筛选中搜索"罗小黑"，解锁隐藏的彩蛋成就分支！
                    探索更多惊喜，发现英语学习的乐趣。
                </p>
                <button class="fog-button" onclick="this.parentElement.parentElement.classList.add('hidden')">
                    我知道了
                </button>
            </div>
        `;
        
        // 添加到奖励中心
        rewardSection.appendChild(fog);
    }
})();

// 添加成就到main对象
if (typeof main !== 'undefined' && !main.getAchievementName('luo_xiao_hei_found')) {
    // 扩展main对象的成就列表
    const originalGetAchievementName = main.getAchievementName;
    main.getAchievementName = function(achievementId) {
        const achievementNames = {
            'luo_xiao_hei_found': '罗小黑发现者',
            'filter_beginner': '筛选初学者',
            'filter_master': '筛选大师',
            'filter_grandmaster': '筛选宗师',
            'search_beginner': '搜索初学者',
            'search_master': '搜索大师',
            'search_grandmaster': '搜索宗师'
        };
        
        return achievementNames[achievementId] || originalGetAchievementName.call(main, achievementId);
    };
}

// 初始化词汇筛选功能
const vocabularyFilter = new VocabularyFilter();

// 导出vocabularyFilter实例供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = vocabularyFilter;
} else {
    window.vocabularyFilter = vocabularyFilter;
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    /* 增强的筛选区域样式 */
    .letter-buttons-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .letter-btn {
        min-width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .letter-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .letter-btn.active {
        background-color: #4CAF50;
        color: white;
        font-weight: bold;
    }
    
    /* 增强的搜索栏样式 */
    .enhanced-search-bar {
        position: relative;
        margin-bottom: 20px;
    }
    
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-height: 200px;
        overflow-y: auto;
    }
    
    .search-suggestion-item {
        padding: 10px 15px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    
    .search-suggestion-item:hover {
        background-color: #f5f5f5;
    }
    
    .search-suggestion-item strong {
        display: block;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .search-suggestion-item span {
        font-size: 12px;
        color: #666;
    }
    
    /* 高级筛选样式 */
    .advanced-filters {
        background: #f9f9f9;
        padding: 20px;
        border-radius: 10px;
        margin-bottom: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: flex-end;
    }
    
    .filter-group {
        flex: 1;
        min-width: 200px;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
    }
    
    /* 排序选项样式 */
    .sort-options {
        margin-bottom: 15px;
    }
    
    .sort-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .sort-group label {
        font-weight: 500;
    }
    
    /* 增强的结果显示样式 */
    .enhanced-filtered-words {
        min-height: 400px;
    }
    
    .word-card {
        background: white;
        border-radius: 10px;
        padding: 15px;
        margin-bottom: 15px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
    }
    
    .word-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }
    
    .word-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    
    .word-info h6 {
        margin: 0 0 5px 0;
        font-size: 18px;
        font-weight: bold;
    }
    
    .phonetic {
        margin: 0;
        color: #666;
        font-size: 14px;
    }
    
    .word-actions {
        display: flex;
        gap: 8px;
    }
    
    .meaning {
        margin: 0 0 10px 0;
        font-size: 16px;
    }
    
    .example {
        background: #f8f9fa;
        padding: 10px;
        border-radius: 6px;
        margin-top: 10px;
        border-left: 4px solid #4CAF50;
    }
    
    .example small {
        font-style: italic;
        color: #555;
    }
    
    .part-of-speech,
    .difficulty {
        margin-top: 10px;
        display: inline-block;
    }
    
    /* 无结果样式 */
    .no-results {
        text-align: center;
        padding: 60px 20px;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    .no-results-icon {
        font-size: 48px;
        color: #6c757d;
        margin-bottom: 20px;
    }
    
    .no-results h6 {
        margin-bottom: 10px;
        color: #333;
    }
    
    .no-results p {
        color: #6c757d;
        margin: 0;
    }
    
    /* 加载状态样式 */
    .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #4CAF50;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* 分页控件样式 */
    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
    }
    
    .page-info {
        font-size: 14px;
        color: #666;
    }
    
    /* 彩蛋背景遮罩 */
    .easter-egg-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.5s ease;
        backdrop-filter: blur(5px);
    }
    
    .easter-egg-overlay.show {
        opacity: 1;
    }
    
    /* 彩蛋样式 */
    .easter-egg-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.5);
        z-index: 9999;
        text-align: center;
        background: white;
        padding: 40px;
        border-radius: 24px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 100px rgba(76, 175, 80, 0.2);
        max-width: 600px;
        width: 95%;
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        overflow: hidden;
    }
    
    .easter-egg-container.show {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    
    /* 发光效果 */
    .easter-egg-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%);
        animation: pulse 2s infinite ease-in-out;
        z-index: 0;
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.8;
        }
    }
    
    .easter-egg-image {
        max-width: 400px;
        max-height: 400px;
        border-radius: 16px;
        margin-bottom: 25px;
        position: relative;
        z-index: 1;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .easter-egg-text {
        font-size: 28px;
        font-weight: bold;
        color: #333;
        margin-bottom: 25px;
        position: relative;
        z-index: 1;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    /* 解锁信息 */
    .easter-egg-unlock {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        padding: 20px;
        border-radius: 12px;
        margin: 20px 0;
        position: relative;
        z-index: 1;
        border: 1px solid #bae6fd;
        animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .unlock-icon {
        font-size: 32px;
        margin-bottom: 10px;
        animation: spin 2s linear infinite;
    }
    
    .easter-egg-unlock p {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #0369a1;
    }
    
    /* 按钮容器 */
    .easter-egg-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 25px;
        position: relative;
        z-index: 1;
    }
    
    .easter-egg-close,
    .easter-egg-achievement {
        padding: 10px 25px;
        font-size: 16px;
        border-radius: 25px;
        transition: all 0.3s ease;
    }
    
    .easter-egg-achievement:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
    }
    
    .easter-egg-close:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(108, 117, 125, 0.3);
    }
    
    .easter-egg-error {
        color: #ff4757;
        font-size: 18px;
        margin: 25px 0;
        position: relative;
        z-index: 1;
    }
    
    /* 成就页面雾效 */
    .achievement-fog {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.8) 100%);
        backdrop-filter: blur(10px);
        z-index: 10;
        transition: all 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        text-align: center;
        padding: 40px;
    }
    
    .achievement-fog.hidden {
        opacity: 0;
        transform: scale(1.1);
        pointer-events: none;
    }
    
    .fog-content {
        max-width: 500px;
        animation: fadeIn 1s ease-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fog-icon {
        font-size: 64px;
        margin-bottom: 20px;
        animation: pulse 2s ease-in-out infinite;
    }
    
    .fog-title {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #333;
    }
    
    .fog-description {
        font-size: 18px;
        margin-bottom: 30px;
        color: #666;
        line-height: 1.5;
    }
    
    .fog-button {
        padding: 12px 30px;
        font-size: 16px;
        border-radius: 25px;
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        border: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }
    
    .fog-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .easter-egg-container {
            padding: 30px;
            max-width: 95%;
        }
        
        .easter-egg-image {
            max-width: 280px;
            max-height: 280px;
        }
        
        .easter-egg-text {
            font-size: 24px;
        }
        
        .easter-egg-buttons {
            flex-direction: column;
            align-items: stretch;
        }
        
        .easter-egg-close,
        .easter-egg-achievement {
            width: 100%;
        }
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .filter-options {
            flex-direction: column;
            align-items: stretch;
        }
        
        .filter-group {
            min-width: 100%;
        }
        
        .sort-group {
            flex-direction: column;
            align-items: stretch;
            text-align: left;
        }
        
        .pagination {
            flex-direction: column;
            gap: 10px;
        }
    }
`;
document.head.appendChild(style);
