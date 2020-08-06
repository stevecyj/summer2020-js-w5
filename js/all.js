// 匯入語系檔案
import zh_TW from "./zh_TW.js";
// 加入至 VeeValidate 的設定檔案
VeeValidate.localize("tw", zh_TW);
// input 驗證
Vue.component("ValidationProvider", VeeValidate.ValidationProvider);
// form 表單驗證
Vue.component("ValidationObserver", VeeValidate.ValidationObserver);
// Class 設定檔案
VeeValidate.configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid",
  },
});
//loading 元件
Vue.component("loading", VueLoading);
Vue.use(VueLoading);

new Vue({
  el: "#app",
  data: {
    products: [],
    tempProduct: {},
    isLoading: false,
    status: {},
    carts: [],
    cartTotal: 0,
    status: {
      loadingItem: "",
    },
    api: {
      uuid: "5bffb293-5936-4139-961e-e2006317c701",
      path: "https://course-ec-api.hexschool.io/api/",
    },
    user: {
      name: "",
      email: "",
      tel: "",
      address: "",
      payment: "",
      message: "",
    },
  },
  methods: {
    getProducts(page = 1) {
      // 參數預設值
      this.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/products?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          this.isLoading = false;
          this.products = res.data.data;
        })
        .catch((error) => {
          this.isLoading = false;
        });
    },
    getProduct(id) {
      this.status.loadingItem = id; //記得預先定義
      const url = `${this.api.path}${this.api.uuid}/ec/product/${id}`;
      axios.get(url).then((res) => {
        this.status.loadingItem = "";
        this.$set(this.tempProduct, "num", 0);
        //基本寫法
        // this.tempProduct = res.data.data;
        // this.tempProduct.num = 1;
        //進階寫法
        this.tempProduct = {
          ...res.data.data,
          num: 1,
        };
        $("#productModal").modal("show");
      });
    },
    getCarts() {
      this.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      axios.get(url).then((res) => {
        this.isLoading = false;
        this.carts = res.data.data;
        this.updateTotal();
      });
    },
    addToCart(id, quantity = 1) {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      this.isLoading = true;
      const cart = {
        product: id,
        quantity: quantity,
      };
      console.log(cart);
      axios
        .post(url, cart)
        .then((res) => {
          this.isLoading = false;
          this.getCarts();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error.response);
        });
    },
    updateTotal() {
      this.carts.forEach((item) => {
        this.cartTotal += item.product.price * item.quantity;
        console.log(this.cartTotal);
      });
    },
    updateQuantity(id, quantity) {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
      this.isLoading = true;
      const cart = {
        product: id,
        quantity: quantity,
      };
      axios
        .patch(url, cart)
        .then((res) => {
          this.isLoading = false;
          this.cartTotal = 0;
          this.getCarts();
        })
        .catch((error) => {
          this.isLoading = false;
          console.log(error.response);
        });
    },
    removeAllCarts() {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping/all/product`;
      axios.delete(url).then((res) => {
        this.getCarts();
        this.cartTotal = 0;
      });
    },
    removeCart(id) {
      const url = `${this.api.path}${this.api.uuid}/ec/shopping/${id}`;
      axios
        .delete(url)
        .then((res) => {
          this.getCarts();
        })
        .catch((res) => {
          console.log(error);
        });
    },
    submitForm() {
      const vm = this;
      vm.isLoading = true;
      const url = `${this.api.path}${this.api.uuid}/ec/orders`;
      axios
        .post(url, this.user)
        .then((res) => {
          console.log(res);
          // if (res.data.data.id) {
          //     vm.isLoading = false;
          //     console.log('成功送出');
          // }
        })
        .catch((error) => {
          vm.isLoading = false;
          console.log(error);
        });
    },
  },
  created() {
    this.getProducts();
    this.getCarts();
  },
});
