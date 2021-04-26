<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center> 购物街 </template>
    </nav-bar>
    <tab-control
      class="tab-control"
      :titles="['流行', '新款', '精选']"
      @tabClick="tabClick"
      ref="tabControl1"
      v-show="isTabfixed"
    ></tab-control>

    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>

      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>

      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import HomeSwiper from "./childComps/HomeSwiper";
import RecommendView from "./childComps/RecommendView";
import FeatureView from "./childComps/FeatureView";

import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabcontrol/TabControl";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backtop/BackTop";

import { getHomeMultidata, getHomeGoods } from "network/home";

import GoodsList from "components/content/goods/GoodsList";

import { debounce } from "common/utils";

export default {
  name: "Home",

  components: {
    NavBar,
    HomeSwiper,
    RecommendView,
    FeatureView,

    TabControl,

    GoodsList,

    Scroll,

    BackTop,
  },

  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },

      currentType: "pop",

      isShowBackTop: false,

      // 记录吸顶的元素位置
      tabOffsetTop: 0,
      isTabfixed: false,

      saveY: 0,
    };
  },

  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },

  created() {
    this.getHomeMultidata();

    this.getHomeGoods("pop");
    this.getHomeGoods("new");
    this.getHomeGoods("sell");
  },

  mounted() {
    // 防抖处理
    const refresh = debounce(this.$refs.scroll.refresh, 500);

    // 监听加载图片事件
    this.$bus.$on("itemImageLoad", () => {
      // console.log("监听到");
      // this.$refs.scroll.refresh();
      refresh();
      // console.log(1);
    });
  },

  activated() {
    this.$refs.scroll.refresh();
    this.$refs.scroll.scrollTo(0, this.saveY, 0);
    this.$refs.scroll.refresh();
  },
  deactivated() {
    this.saveY = this.$refs.scroll.getScrollY();
  },

  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },

      currentType: "pop",

      isShowBackTop: false,

      // 记录吸顶的元素位置
      tabOffsetTop: 0,
      isTabfixed: false,

      saveY: 0,
    };
  },

  methods: {
    // 防抖函数

    // 获取函数
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
          break;
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    // 获取数据
    getHomeMultidata() {
      getHomeMultidata()
        .then((res) => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
          // console.log(this.banners);
        })
        .catch((reason) => {
          console.log(reason);
        });
    },
    getHomeGoods(type) {
      let page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
        // console.log(this.goods);

        this.$refs.scroll.finishPullUp();
      });
    },

    // 点击返回top
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },

    // 监听位置
    contentScroll(position) {
      // console.log(position.y);
      this.isShowBackTop = -position.y > 1000;

      // 决定tabControl是否吸顶
      this.isTabfixed = -position.y > this.tabOffsetTop;
    },

    // 加载更多
    loadMore() {
      // console.log(111);
      this.getHomeGoods(this.currentType);
      // console.log(this.goods[this.currentType].list.length);
      this.$refs.scroll.scroll.refresh();
    },

    // 监听轮播图加载完成，然后获取相应位置
    swiperImageLoad() {
      // console.log(this.$refs.tabControl.$el.offsetTop);
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
  },
};
</script>

<style scoped>
#home {
  /*padding-top: 44px;*/
  height: 100vh;
  position: relative;
}

.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
  /*position: fixed;*/
  /*left: 0;*/
  /*right: 0;*/
  /*top: 0;*/
  /*z-index: 9;*/
}

.content {
  overflow: hidden;

  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
}

.tab-control {
  position: relative;
  z-index: 9;
}
</style>
