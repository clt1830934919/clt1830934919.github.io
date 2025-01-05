// sessionStorage 管理
const Storage = {
    // 评论相关
    comments: {
        get: function() {
            return JSON.parse(sessionStorage.getItem('comments') || '[]');
        },
        save: function(comments) {
            sessionStorage.setItem('comments', JSON.stringify(comments));
        },
        add: function(comment) {
            const comments = this.get();
            comments.push({
                id: Date.now(),
                ...comment,
                likes: 0,
                time: new Date().toISOString()
            });
            this.save(comments);
        },
        like: function(commentId) {
            const comments = this.get();
            const comment = comments.find(c => c.id === commentId);
            if (comment) {
                comment.likes++;
                this.save(comments);
            }
        }
    },

    // 投票相关
    votes: {
        get: function() {
            return JSON.parse(sessionStorage.getItem('votes') || '{"options":{}, "voters":[]}');
        },
        save: function(votes) {
            sessionStorage.setItem('votes', JSON.stringify(votes));
        },
        vote: function(optionId, userId) {
            const votes = this.get();
            if (!votes.voters.includes(userId)) {
                votes.options[optionId] = (votes.options[optionId] || 0) + 1;
                votes.voters.push(userId);
                this.save(votes);
                return true;
            }
            return false;
        }
    },

    // 清理过期数据
    cleanup: function() {
        const ONE_MONTH = 30 * 24 * 60 * 60 * 1000; // 30天的毫秒数
        const comments = this.comments.get();
        const now = Date.now();
        
        // 清理超过一个月的评论
        const filteredComments = comments.filter(comment => {
            return now - new Date(comment.time).getTime() < ONE_MONTH;
        });
        
        if (filteredComments.length !== comments.length) {
            this.comments.save(filteredComments);
        }
    }
};
