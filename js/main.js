// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有交互功能
    Interaction.init();

    // 定期清理过期数据
    Storage.cleanup();

    // 初始化时间轴数据
    // initTimelineData();

    // 初始化案例数据
    // initCasesData();

    // 解决方案标签页切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // 添加当前活动状态
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 视频播放功能
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoPlayer = this.nextElementSibling;
            this.style.display = 'none';
            videoPlayer.style.display = 'block';
            videoPlayer.play();
        });
    });

    // 导航滚动监听
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        // 获取当前滚动位置
        const scrollPosition = window.scrollY + 100; // 添加偏移量以提前触发

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有激活状态
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // 添加当前部分的激活状态
                const correspondingLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // 添加滚动事件监听
    document.addEventListener('scroll', updateActiveNavLink);

    // 平滑滚动到锚点
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 初始化导航状态
    updateActiveNavLink();
});

// 初始化时间轴数据
function initTimelineData() {
    const timelineData = [
        {
            date: '2024年12月15日',
            title: '事件发生',
            content: '小学生在校内不幸遭遇车祸'
        },
        {
            date: '2024年12月16日',
            title: '消息传播',
            content: '事件在社交媒体引发关注'
        },
        {
            date: '2024年12月17日',
            title: '网络暴力出现',
            content: '受害者家属遭遇网络暴力'
        },
        {
            date: '2024年12月20日',
            title: '社会关注',
            content: '多家媒体报道网络暴力现象'
        }
    ];

    const timeline = document.querySelector('.timeline');
    timeline.innerHTML = timelineData.map(item => `
        <div class="timeline-item">
            <div class="timeline-date">${item.date}</div>
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        </div>
    `).join('');
}

// 初始化案例数据
function initCasesData() {
    const casesData = [
        {
            title: '明星遭遇网暴事件',
            content: '某明星因为一句话被断章取义，遭遇大规模网络暴力...',
            image: 'assets/images/case1.jpg'
        },
        {
            title: '普通网民被网暴',
            content: '一位普通网民因发表个人观点，遭到网络暴力...',
            image: 'assets/images/case2.jpg'
        },
        {
            title: '学生遭遇校园网暴',
            content: '一名学生因为特立独行的穿着打扮，在网络上遭到嘲笑...',
            image: 'assets/images/case3.jpg'
        }
    ];

    const casesSlider = document.querySelector('.cases-slider');
    casesSlider.innerHTML = casesData.map(item => `
        <div class="case-card">
            <div class="case-image" style="background-image: url(${item.image})"></div>
            <div class="case-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
            </div>
        </div>
    `).join('');
}

// 添加滚动动画
function addScrollAnimation() {
    const elements = document.querySelectorAll('.section-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}
