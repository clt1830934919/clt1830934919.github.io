// 交互功能管理
const Interaction = {
    // 初始化所有交互功能
    init: function() {
        // 确保只初始化一次
        if (this.initialized) return;
        this.initialized = true;
        
        this.initComments();
        this.initVoting();
        this.initScrollEffects();
    },

    // 评论功能
    initComments: function() {
        // 从sessionStorage加载评论
        this.loadComments();

        // 提交评论
        const submitBtn = document.getElementById('submitComment');
        if (submitBtn) {
            // 移除可能存在的旧事件监听器
            submitBtn.removeEventListener('click', this.handleCommentSubmit);
            // 添加新的事件监听器
            submitBtn.addEventListener('click', this.handleCommentSubmit.bind(this));
        }

        // 委托事件处理点赞
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
            commentsList.removeEventListener('click', this.handleCommentLike);
            commentsList.addEventListener('click', this.handleCommentLike.bind(this));
        }
    },

    // 处理评论提交
    handleCommentSubmit: function(e) {
        e.preventDefault(); // 防止表单默认提交
        
        const nameInput = document.getElementById('commentName');
        const contentInput = document.getElementById('commentContent');
        
        const name = nameInput.value.trim();
        const content = contentInput.value.trim();
        
        console.log('Name:', name); // 调试日志
        console.log('Content:', content); // 调试日志

        if (!name || !content) {
            alert('请填写昵称和评论内容');
            return;
        }

        const comment = {
            id: Date.now(),
            author: name,
            content: content,
            date: new Date().toISOString(),
            likes: 0,
            liked: false
        };

        this.addComment(comment);
        this.saveComments();

        // 清空输入
        nameInput.value = '';
        contentInput.value = '';
        
        // 提示成功
        alert('评论发表成功！');
    },

    // 处理评论点赞
    handleCommentLike: function(e) {
        if (e.target.closest('.comment-action')) {
            const commentId = parseInt(e.target.closest('.comment-item').dataset.id);
            this.toggleLike(commentId);
        }
    },

    // 加载评论
    loadComments: function() {
        const comments = JSON.parse(sessionStorage.getItem('comments') || '[]');
        comments.forEach(comment => this.addComment(comment));
    },

    // 保存评论到sessionStorage
    saveComments: function() {
        const comments = Array.from(document.querySelectorAll('.comment-item')).map(item => ({
            id: parseInt(item.dataset.id),
            author: item.querySelector('.comment-author').textContent,
            content: item.querySelector('.comment-content').textContent,
            date: item.querySelector('.comment-date').dataset.date,
            likes: parseInt(item.querySelector('.like-count').textContent),
            liked: item.querySelector('.comment-action').classList.contains('active')
        }));
        sessionStorage.setItem('comments', JSON.stringify(comments));
    },

    // 添加评论到DOM
    addComment: function(comment) {
        const commentsList = document.querySelector('.comments-list');
        const date = new Date(comment.date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        const commentHtml = `
            <div class="comment-item" data-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-date" data-date="${comment.date}">${formattedDate}</span>
                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-actions">
                    <span class="comment-action ${comment.liked ? 'active' : ''}">
                        <i class="fa-solid fa-thumbs-up"></i>
                        <span class="like-count">${comment.likes}</span>
                    </span>
                </div>
            </div>
        `;
        
        commentsList.insertAdjacentHTML('afterbegin', commentHtml);
    },

    // 切换点赞状态
    toggleLike: function(commentId) {
        const commentItem = document.querySelector(`.comment-item[data-id="${commentId}"]`);
        const likeAction = commentItem.querySelector('.comment-action');
        const likeCount = commentItem.querySelector('.like-count');
        
        if (likeAction.classList.toggle('active')) {
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        } else {
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        }
        
        this.saveComments();
    },

    // 投票功能
    initVoting: function() {
        const voteSubmit = document.querySelector('.vote-submit');
        if (voteSubmit) {
            voteSubmit.addEventListener('click', () => {
                const selectedOption = document.querySelector('input[name="vote"]:checked');
                if (!selectedOption) {
                    alert('请选择一个选项');
                    return;
                }

                // 检查是否已经投票
                if (sessionStorage.getItem('hasVoted')) {
                    alert('您已经参与过投票了');
                    return;
                }

                // 保存投票状态
                sessionStorage.setItem('hasVoted', 'true');
                sessionStorage.setItem('votedOption', selectedOption.value);

                // 更新UI
                voteSubmit.textContent = '已投票';
                voteSubmit.disabled = true;
                
                alert('投票成功！感谢您的参与');
            });
        }

        // 检查是否已投票并更新UI
        if (sessionStorage.getItem('hasVoted')) {
            const voteSubmit = document.querySelector('.vote-submit');
            if (voteSubmit) {
                voteSubmit.textContent = '已投票';
                voteSubmit.disabled = true;
            }
        }
    },

    // 滚动效果
    initScrollEffects: function() {
        const sections = document.querySelectorAll('section');
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            section.classList.add('fade-in');
            observer.observe(section);
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    Interaction.init();
});
