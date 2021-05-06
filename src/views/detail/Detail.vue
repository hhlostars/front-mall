<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <detail-swiper :top-images="topImages" />
      <detail-base-info :goods="goods" />
      <detail-shop-info :shop="shop" />
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <detail-param-info ref="params" :param-info="paramInfo" />
      <detail-comment-info ref="comment" :comment-info="commentInfo" />
      <goods-list ref="recommend" :goods="goodsList"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <toast :message="message" :show="show"></toast>
  </div>
</template>


<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import GoodsList from "components/content/goods/GoodsList";

import BackTop from "components/content/backtop/BackTop";

import Toast from "components/common/toast/Toast";

import {
  getDetail,
  Goods,
  Shop,
  GoodsParam,
  getRecommend,
} from "network/detail";

import Scroll from "components/common/scroll/Scroll";

import { mapActions } from "vuex";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList,
    BackTop,
    Toast,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      goodsList: [],
      themeTops: [],
      currentIndex: 0,
      isShowBackTop: false,
      message: "",
      show: false,
    };
  },
  created() {
    this.iid = this.$route.params.id;
    // console.log(this.id);

    // 获取数据
    getDetail(this.iid).then((res) => {
      // console.log(res);
      const data = res.result;
      this.topImages = data.itemInfo.topImages;

      // 获取商品详情
      this.goods = new Goods(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );
      // console.log(this.goods);

      // 创建店铺信息的对象
      this.shop = new Shop(data.shopInfo);

      // 保存商品的详情数据
      this.detailInfo = data.detailInfo;

      // 获取参数的信息
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      // 获取评论信息
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }

      getRecommend().then((res) => {
        this.goodsList = res.data.list;
      });
    });
  },
  methods: {
    ...mapActions(["addCart"]),
    imageLoad() {
      this.$refs.scroll.refresh();
      console.log("----");
      this.themeTops = [];
      this.themeTops.push(0);
      this.themeTops.push(this.$refs.params.$el.offsetTop);
      this.themeTops.push(this.$refs.comment.$el.offsetTop);
      this.themeTops.push(this.$refs.recommend.$el.offsetTop);
      // console.log(this.themeTops);
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -(this.themeTops[index] - 44), 200);
      this.currentIndex = index;
    },
    contentScroll(position) {
      this.isShowBackTop = -position.y > 1000;

      const positionY = -(position.y - 44);
      // let length = this.themeTops.length;
      // console.log(this.themeTops);
      // console.log(positionY);

      let a = this.themeTops[1];
      let b = this.themeTops[2];
      let c = this.themeTops[3];
      if (positionY >= a && positionY < b) {
        this.currentIndex = 1;
      } else if (positionY >= b && positionY < c) {
        this.currentIndex = 2;
      } else if (positionY >= c) {
        this.currentIndex = 3;
      } else {
        this.currentIndex = 0;
      }
      this.$refs.nav.currentIndex = this.currentIndex;
    },
    // 点击返回top
    backClick() {
      this.$refs.scroll.scrollTo(0, 0);
    },

    addToCart() {
      // console.log('111');
      // 保存获取的数据
      const obj = {};
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0];
      obj.title = this.goods.title;
      obj.desc = this.goods.desc;
      obj.price = this.goods.realPrice;

      // this.$store.commit("addCart", obj );
      // 添加到购物车
      // this.$store.dispatch("addCart", obj).then((res) => {
      //   console.log(res);
      // });
      this.addCart(obj).then((res) => {
        // console.log(res);
        this.show = true;
        this.message = res;

        setTimeout(() => {
          this.show = false;
          this.message = "";
        }, 1000);
      });
    },
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>