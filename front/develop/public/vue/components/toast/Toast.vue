<template>
  <transition name="fade" @after-enter=" hide " @after-leave=" nextTips ">
    <div class="tips" v-if="tips">
      <div class="tips-inner">{{tips}}</div>
    </div>
  </transition>
</template>
<script>
export default {
    name: "Toast",
    data: function() {
        return {
            tipsQueue: []
        };
    },
    computed: {
        tips: function() {
            return this.tipsQueue[0];
        }
    },
    methods: {
        showTips: function(tips) {
            this.tipsQueue.push(tips);
        },
        nextTips: function() {
            this.tipsQueue = this.tipsQueue.slice(2);
        },
        hide: function() {
            this.tipsQueue.unshift("");
        }
    }
};
</script>
<style lang="less" scope>
@import (reference) "../../../less/mixin";
.tips {
    position: fixed;
    width: 100%;
    bottom: 20%;
    text-align: center;
    z-index: 4000;
}

.tips-inner {
    display: inline-block;
    max-width: 80%;
    padding: 30 * @base 70 * @base;
    color: #000;
    background: #ca9755;
    .mix-fontsize(28);
    border-radius: 20 * @base;
}

.fade-leave-active {
    animation: fade 5s;
}

@keyframes fade {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
