
new Vue({
    el: '#app',
    data: {
        //APIから取得したきた検索結果を格納
        api: null,
        //セレクトされた県
        selectKeyword: '',
        //ユーザーが入力した検索キーワード
        inputKeyword: '',
        //checkされたかどうか
        check: 0,

        checked: false,

        //ユーザーに表示するメッセージ
        message: 'おなかへった〜〜。。個室が一番〜！',
        message2: '検索エリアとジャンル選択するだけでも検索できるよ',

        // APIから取得してきたPREFと県名を格納
        prefCodes: {},

        img: true,

        loading: true,

        disabled: true,

        //ユーザーが選択した項目
        foods: [
            "お肉",
            "魚",
            "焼き鳥",
            "パスタ",
            "鍋",
            "ハンバーグ",
            "寿司",
            "とんかつ",
            "中華料理",
            "イタリアン",
            "フレンチ",
            "パンケーキ",
            "指定なし"
        ],

        selectFoods: ""

    },

    watch: {
        //入力してるかどうか監視

        //県
        selectKeyword: function (val) {
            var btn = document.querySelector('.btnSearch');

            if (this.selectFoods === "指定なし") {
                this.selectFoods = ""
            }

            if (val) {
                if (this.inputKeyword || this.selectFoods) {

                    if (this.inputKeyword && this.selectFoods) {
                        this.disabled = true;
                        btn.classList.add('check');
                    } else {
                        this.disabled = false;
                        btn.classList.remove('check');
                    }


                } else {
                    this.disabled = true;
                    btn.classList.add('check');
                }

            } else {
                this.disabled = true;
                btn.classList.add('check');
            }
        },

        //フリーワード
        inputKeyword: function (val) {
            var btn = document.querySelector('.btnSearch');
            if (val) {
                if (this.selectKeyword) {
                    this.disabled = false;
                    btn.classList.remove('check');


                } else {
                    this.disabled = true;
                    btn.classList.add('check');
                }

                if (this.selectFoods) {
                    this.disabled = true;
                    btn.classList.add('check');

                }


            } else {

                if (!this.selectFoods) {
                    this.disabled = true;
                    btn.classList.add('check');

                }

                if (this.selectFoods && this.selectKeyword) {
                    this.disabled = false;
                    btn.classList.remove('check');
                }



            }
        },

        //選択されているかどうか監視
        //ジャンル
        selectFoods: function (val) {
            var btn = document.querySelector('.btnSearch');
            // console.log(val);

            // let selectFood = "";

            if (this.selectFoods === "指定なし") {
                this.selectFoods = ""
            }

            if (val) {
                // console.log(val);
                if (this.selectKeyword) {
                    this.disabled = false;
                    btn.classList.remove('check');
                    // console.log("ture")

                } else {
                    this.disabled = true;
                    btn.classList.add('check');
                    // console.log("false")
                }

                if (this.inputKeyword) {
                    this.disabled = true;
                    btn.classList.add('check');
                }


            } else {

                if (this.inputKeyword && this.selectKeyword) {
                    this.disabled = false;
                    btn.classList.remove('check');
                } else {
                    this.disabled = true;
                    btn.classList.add('check');
                }
            }
        }

    },
    //APIと通信
    //mountedとはインスタンスがマウントされた後に実行
    mounted: function () {

        //都道府県API
        axios.get('https://api.gnavi.co.jp/master/PrefSearchAPI/v3/?keyid=7d39ae992d219971d96c9de69f932224')
            .then(function (res) {
                res.data.pref.forEach(element => {
                    //APIから取得してきたPREFと県名を格納
                    this.$set(this.prefCodes, element.pref_code, element.pref_name);
                });
            }.bind(this))
            //通信エラーした場合の処理
            .catch(function (error) {
                this.message = "Error" + error;
            }.bind(this))
            //finallyメソッドは通信に関する処理が終わったら実装される
            .finally(function () {

            }.bind(this))


    },

    methods: {

        checkPrivate: function () {
            if (this.checked === true) {
                this.check = 1;
            } else {
                this.check = 0;
            }
        },

        //検索ボタンがクリックされたらレストランAPIをたたく
        searchclick: function () {

            this.message = 'loading....'
            this.message2 = ""

            if (this.selectFoods === "指定なし") {
                this.selectFoods = ""
            }


            const $sectionItme = document.getElementById('sectionItme');
            while ($sectionItme.firstChild) {
                $sectionItme.removeChild($sectionItme.firstChild);
            }

            var params = {
                keyid: '7d39ae992d219971d96c9de69f932224',
                pref: this.selectKeyword,
                freeword: this.inputKeyword + '  ' + this.selectFoods,

                private_room: this.check,
            }

            axios.get('https://api.gnavi.co.jp/RestSearchAPI/v3/?', { params })
                //データを使用する。 resにAPIからのデータが帰ってくる
                .then(function (respo) {
                    this.img = false,
                        respo.data.rest.forEach(rest => {
                            var nameShop = rest.name;
                            var urlShop = rest.url;
                            var addressShop = rest.address;
                            var imgShop = rest.image_url.shop_image1;
                            var prShort = rest.pr.pr_short;
                            var opentime = rest.opentime;
                            var holiday = rest.holiday;


                            $sectionItme.insertAdjacentHTML('beforeend',
                                `<div class="item">
                            <figure>
                                <div class="figurewrap">

                                    <img src="${imgShop}" alt="店舗画像" class="shopImg" onerror="this.onerror=null;this.src='img/noimg.png'" >


                                    <figcaption>${prShort}</figcaption>
                                </div>
                            </figure>
                            <div class="item-r">
                                <table>
                                    <tr>
                                        <th>店名</th>
                                        <td>${nameShop}</td>
                                    </tr>
                                    <tr>
                                        <th>住所</th>
                                        <td>${addressShop}</td>
                                    </tr>
                                    <tr>
                                        <th>営業時間</th>
                                        <td>${opentime}</td>
                                    </tr>
                                    <tr>
                                        <th>休日</th>
                                        <td>${holiday}</td>
                                    </tr>
                                </table>
                                <div class="btnwrap">
                                    <a href="${urlShop}" class="viewbtn" target="_blank" rel="noopener noreferrer">予約する</a>
                                </div>

                            </div>
                        </div>`);

                        })
                }.bind(this))
                //通信エラーした場合の処理
                .catch(function (error) {
                    this.img = true,
                        this.message = "Error" + error;
                    this.message2 = ""
                }.bind(this))
                //finallyメソッドは通信に関する処理が終わったら実装される
                .finally(function () {
                    this.message = ''
                    this.message2 = ""
                }.bind(this))

        }
    }
})
