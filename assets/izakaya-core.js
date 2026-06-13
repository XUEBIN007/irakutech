(function (root) {
  const STORE_KEY = 'irakutech.honcho-chinese.store.v1';
  const CART_PREFIX = 'irakutech.mini.cart.';

  const seed = {
    restaurant: {
      nameJa: '本町中華食堂（仮）',
      nameZh: '本町中华食堂（暂定）',
      nameEn: 'Honcho Chinese Kitchen (Pilot)',
      shortName: '本町中華',
      address: '船橋市本町エリア',
      phone: '店頭確認',
      station: '京成船橋駅西口から徒歩約5分 / JR船橋駅から徒歩約7分',
      notes: [
        '公開情報とGoogle写真をもとにした導入用デモです。店名・価格は店頭確認後に確定します。',
        '食べ飲み放題は4名様から、ラストオーダーは終了15分前。',
        '公開情報では現金中心の会計です。正式導入時に支払い方法を確認してください。'
      ]
    },
    settings: {
      defaultPaymentMethod: 'cash',
      cashFirst: true,
      paymentMethods: [
        { id: 'cash', enabled: true, nameJa: '現金', nameZh: '现金', nameEn: 'Cash' },
        { id: 'card', enabled: false, nameJa: 'カード', nameZh: '刷卡', nameEn: 'Card' },
        { id: 'qr', enabled: false, nameJa: 'QR決済', nameZh: 'QR支付', nameEn: 'QR Payment' }
      ],
      serviceMode: 'table-qr',
      paymentNote: '公開情報では現金中心。カード・QR決済は店頭確認後に有効化。'
    },
    categories: [
      { id: 'recommended', nameJa: 'おすすめ', nameZh: '推荐', nameEn: 'Recommended' },
      { id: 'setmeal', nameJa: '定食', nameZh: '套餐定食', nameEn: 'Set Meals' },
      { id: 'banquet', nameJa: '晩酌セット', nameZh: '小酌套餐', nameEn: 'Drink Set' },
      { id: 'course', nameJa: '食べ飲み放題', nameZh: '吃喝放题', nameEn: 'All-you-can-eat' },
      { id: 'noodle', nameJa: '麺・拉麺', nameZh: '面类', nameEn: 'Noodles' },
      { id: 'rice', nameJa: '飯類', nameZh: '饭类', nameEn: 'Rice' },
      { id: 'dimsum', nameJa: '点心', nameZh: '点心', nameEn: 'Dim Sum' },
      { id: 'cold', nameJa: '前菜・冷菜', nameZh: '凉菜前菜', nameEn: 'Cold Dishes' },
      { id: 'meat', nameJa: '肉料理', nameZh: '肉类', nameEn: 'Meat' },
      { id: 'seafood', nameJa: '海鮮・野菜', nameZh: '海鲜蔬菜', nameEn: 'Seafood & Vegetables' },
      { id: 'fried', nameJa: '揚げ物', nameZh: '炸物', nameEn: 'Fried' },
      { id: 'drink', nameJa: 'ドリンク', nameZh: '饮料酒水', nameEn: 'Drinks' }
    ],
    menu: [
      { id: 'tabe-nomi-3500', categoryId: 'course', icon: '🎉', nameJa: '食べ飲み放題 120分', nameZh: '120分钟吃喝放题', nameEn: '120 min all-you-can-eat & drink', price: 3500, desc: '4名様から。100品以上・50種類以上飲み放題。L.O.15分前。', recommended: true, soldOut: false },
      { id: 'banshaku-set', categoryId: 'banquet', icon: '🍺', nameJa: '晩酌セット', nameZh: '小酌套餐', nameEn: 'Evening drink set', price: 680, desc: '飲み物1杯 + 料理1品。生ビール、サワー、ハイ類、焼酎、ソフトドリンク。', recommended: true, soldOut: false },
      { id: 'sweet-sour-pork', categoryId: 'recommended', icon: '🥢', nameJa: '酢豚', nameZh: '咕咾肉', nameEn: 'Sweet and sour pork', price: 890, desc: '公開メニュー掲載の定番人気料理。', recommended: true, soldOut: false },
      { id: 'green-pepper-pork', categoryId: 'recommended', icon: '🫑', nameJa: 'チンジャオロース', nameZh: '青椒肉丝', nameEn: 'Green pepper pork', price: 790, desc: '写真と公開メニューに合う人気中華。', recommended: true, soldOut: false },
      { id: 'shrimp-mayo', categoryId: 'recommended', icon: '🍤', nameJa: 'エビのマヨネーズ和え', nameZh: '蛋黄虾仁', nameEn: 'Shrimp mayonnaise', price: 890, desc: '晩酌セット写真にも見える人気海鮮。', recommended: true, soldOut: false },
      { id: 'pork-fried-set', categoryId: 'setmeal', icon: '🍱', nameJa: '豚肩ロース揚げオイスターソース炒め定食', nameZh: '炸猪肩肉蚝油炒定食', nameEn: 'Fried pork shoulder oyster sauce set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'liver-egg-set', categoryId: 'setmeal', icon: '🍱', nameJa: 'レバー玉ネギ黒胡椒炒め定食', nameZh: '猪肝洋葱黑胡椒定食', nameEn: 'Liver onion black pepper set', price: 680, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'shrimp-egg-chili-set', categoryId: 'setmeal', icon: '🍱', nameJa: 'エビ玉子チリソース炒め定食', nameZh: '虾仁鸡蛋辣酱定食', nameEn: 'Shrimp egg chili set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'pork-egg-fungus-set', categoryId: 'setmeal', icon: '🍱', nameJa: '豚肉・木耳・玉子炒め定食', nameZh: '木须肉定食', nameEn: 'Pork egg wood ear set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'yodare-chicken-set', categoryId: 'setmeal', icon: '🍱', nameJa: 'よだれ鶏定食', nameZh: '口水鸡定食', nameEn: 'Mouthwatering chicken set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'mapo-tofu-set', categoryId: 'setmeal', icon: '🍱', nameJa: 'マーボー豆腐定食', nameZh: '麻婆豆腐定食', nameEn: 'Mapo tofu set', price: 680, desc: '店頭白板の定食メニュー。', recommended: true, soldOut: false },
      { id: 'pork-kimchi-set', categoryId: 'setmeal', icon: '🍱', nameJa: '豚バラキムチチャーハン定食', nameZh: '猪五花泡菜炒饭定食', nameEn: 'Pork kimchi fried rice set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'thick-fried-miso-rice', categoryId: 'setmeal', icon: '🍱', nameJa: '厚揚げと高菜肉味噌ご飯定食', nameZh: '厚炸豆腐高菜肉酱饭定食', nameEn: 'Tofu mustard greens miso rice set', price: 780, desc: '店頭白板の定食メニュー。', recommended: false, soldOut: false },
      { id: 'spicy-miso-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '辛味噌拉麺', nameZh: '辣味噌拉面', nameEn: 'Spicy miso ramen', price: 790, desc: '写真掲載の拉麺。半炒飯 +100円、大盛り +100円。', recommended: true, soldOut: false },
      { id: 'seafood-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '海鮮拉麺', nameZh: '海鲜拉面', nameEn: 'Seafood ramen', price: 790, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'tantanmen', categoryId: 'noodle', icon: '🍜', nameJa: '担々麺', nameZh: '担担面', nameEn: 'Tantanmen', price: 790, desc: '胡麻と辛味の人気麺。', recommended: true, soldOut: false },
      { id: 'char-siu-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '叉焼拉麺', nameZh: '叉烧拉面', nameEn: 'Char siu ramen', price: 790, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'canton-men', categoryId: 'noodle', icon: '🍜', nameJa: '広東麺', nameZh: '广东面', nameEn: 'Canton noodles', price: 790, desc: '具だくさんのあんかけ麺。', recommended: false, soldOut: false },
      { id: 'wonton-men', categoryId: 'noodle', icon: '🍜', nameJa: 'ワンタン麺', nameZh: '云吞面', nameEn: 'Wonton noodles', price: 790, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'chicken-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '鶏肉拉麺', nameZh: '鸡肉拉面', nameEn: 'Chicken ramen', price: 790, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'sanratanmen', categoryId: 'noodle', icon: '🍜', nameJa: 'サンラータンメン', nameZh: '酸辣汤面', nameEn: 'Hot and sour noodles', price: 790, desc: '酸味と辛味のスープ麺。', recommended: false, soldOut: false },
      { id: 'taiwan-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '台湾拉麺', nameZh: '台湾拉面', nameEn: 'Taiwan ramen', price: 690, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'miso-ramen', categoryId: 'noodle', icon: '🍜', nameJa: '味噌拉麺', nameZh: '味噌拉面', nameEn: 'Miso ramen', price: 690, desc: '写真掲載の拉麺。', recommended: false, soldOut: false },
      { id: 'gomoku-fried-rice', categoryId: 'rice', icon: '🍚', nameJa: '五目チャーハン', nameZh: '五目炒饭', nameEn: 'Mixed fried rice', price: 680, desc: '公開メニュー掲載の飯類。', recommended: true, soldOut: false },
      { id: 'takana-fried-rice', categoryId: 'rice', icon: '🍚', nameJa: '高菜チャーハン', nameZh: '高菜炒饭', nameEn: 'Mustard greens fried rice', price: 680, desc: '公開メニュー掲載の飯類。', recommended: false, soldOut: false },
      { id: 'egg-fried-rice', categoryId: 'rice', icon: '🍚', nameJa: '玉子チャーハン', nameZh: '鸡蛋炒饭', nameEn: 'Egg fried rice', price: 650, desc: 'シンプルな定番炒飯。', recommended: false, soldOut: false },
      { id: 'seafood-fried-rice', categoryId: 'rice', icon: '🍚', nameJa: '海鮮チャーハン', nameZh: '海鲜炒饭', nameEn: 'Seafood fried rice', price: 780, desc: '海鮮入り炒飯。', recommended: false, soldOut: false },
      { id: 'chuka-don', categoryId: 'rice', icon: '🍛', nameJa: '中華丼', nameZh: '中华盖饭', nameEn: 'Chinese rice bowl', price: 780, desc: '野菜と肉のあんかけご飯。', recommended: false, soldOut: false },
      { id: 'tenshin-don', categoryId: 'rice', icon: '🍛', nameJa: '天津丼', nameZh: '天津饭', nameEn: 'Crab omelet rice bowl', price: 780, desc: 'ふんわり玉子のあんかけ丼。', recommended: false, soldOut: false },
      { id: 'grilled-gyoza', categoryId: 'dimsum', icon: '🥟', nameJa: '焼き餃子（6ヶ）', nameZh: '煎饺（6个）', nameEn: 'Pan-fried gyoza (6)', price: 380, desc: '晩酌セット写真掲載。', recommended: true, soldOut: false },
      { id: 'soup-gyoza', categoryId: 'dimsum', icon: '🥟', nameJa: '担々スープ餃子（6ヶ）', nameZh: '担担汤饺（6个）', nameEn: 'Tantan soup gyoza (6)', price: 580, desc: '写真掲載の点心。', recommended: false, soldOut: false },
      { id: 'water-gyoza', categoryId: 'dimsum', icon: '🥟', nameJa: '水餃子（6ヶ）', nameZh: '水饺（6个）', nameEn: 'Boiled dumplings (6)', price: 480, desc: '写真掲載の点心。', recommended: false, soldOut: false },
      { id: 'xiao-long-bao', categoryId: 'dimsum', icon: '🥟', nameJa: '小籠包（4ヶ）', nameZh: '小笼包（4个）', nameEn: 'Soup dumplings (4)', price: 580, desc: '写真掲載の点心。', recommended: true, soldOut: false },
      { id: 'shumai', categoryId: 'dimsum', icon: '🥟', nameJa: '焼売（4ヶ）', nameZh: '烧卖（4个）', nameEn: 'Shumai (4)', price: 480, desc: '写真掲載の点心。', recommended: false, soldOut: false },
      { id: 'spring-roll', categoryId: 'dimsum', icon: '🥠', nameJa: '五目春巻（3ヶ）', nameZh: '五目春卷（3个）', nameEn: 'Spring rolls (3)', price: 480, desc: '写真掲載の点心。', recommended: false, soldOut: false },
      { id: 'sesame-dumpling', categoryId: 'dimsum', icon: '⚪', nameJa: 'ゴマ団子（3ヶ）', nameZh: '芝麻球（3个）', nameEn: 'Sesame balls (3)', price: 420, desc: 'デザートにも合う点心。', recommended: false, soldOut: false },
      { id: 'banbanji', categoryId: 'cold', icon: '🥒', nameJa: 'バンバンジー', nameZh: '棒棒鸡', nameEn: 'Banbanji chicken', price: 580, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'yodare-chicken', categoryId: 'cold', icon: '🌶️', nameJa: 'よだれ鶏', nameZh: '口水鸡', nameEn: 'Mouthwatering chicken', price: 580, desc: '写真掲載の前菜。', recommended: true, soldOut: false },
      { id: 'cucumber-salad', categoryId: 'cold', icon: '🥒', nameJa: 'きゅうりの和え物', nameZh: '凉拌黄瓜', nameEn: 'Cucumber salad', price: 380, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'pitan-tofu', categoryId: 'cold', icon: '🥚', nameJa: 'ピータン豆腐', nameZh: '皮蛋豆腐', nameEn: 'Century egg tofu', price: 480, desc: '写真掲載の冷菜。', recommended: false, soldOut: false },
      { id: 'edamame', categoryId: 'cold', icon: '🫛', nameJa: '枝豆', nameZh: '毛豆', nameEn: 'Edamame', price: 350, desc: '晩酌に合う定番。', recommended: false, soldOut: false },
      { id: 'mapo-tofu', categoryId: 'meat', icon: '🌶️', nameJa: 'マーボー豆腐', nameZh: '麻婆豆腐', nameEn: 'Mapo tofu', price: 780, desc: '写真掲載の人気料理。', recommended: true, soldOut: false },
      { id: 'twice-cooked-pork', categoryId: 'meat', icon: '🥘', nameJa: 'ホイコーロー', nameZh: '回锅肉', nameEn: 'Twice-cooked pork', price: 790, desc: '写真掲載の中華定番。', recommended: true, soldOut: false },
      { id: 'stir-pork-garlic', categoryId: 'meat', icon: '🥘', nameJa: '豚肉とニンニクの芽炒め', nameZh: '蒜苗炒肉', nameEn: 'Pork with garlic shoots', price: 790, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'black-vinegar-pork', categoryId: 'meat', icon: '🥘', nameJa: '黒酢酢豚', nameZh: '黑醋咕咾肉', nameEn: 'Black vinegar pork', price: 890, desc: '写真掲載の人気料理。', recommended: true, soldOut: false },
      { id: 'tomato-egg', categoryId: 'meat', icon: '🍅', nameJa: 'トマトと玉子炒め', nameZh: '番茄炒蛋', nameEn: 'Tomato and egg stir-fry', price: 680, desc: '写真掲載の家庭風中華。', recommended: false, soldOut: false },
      { id: 'liver-nira', categoryId: 'meat', icon: '🥬', nameJa: 'レバニラ炒め', nameZh: '韭菜炒猪肝', nameEn: 'Liver and chive stir-fry', price: 790, desc: '写真掲載の定番。', recommended: false, soldOut: false },
      { id: 'yu-lin-chi', categoryId: 'meat', icon: '🍗', nameJa: 'ユーリンチー', nameZh: '油淋鸡', nameEn: 'Yurinchi chicken', price: 790, desc: '写真掲載の人気鶏料理。', recommended: true, soldOut: false },
      { id: 'stir-veg-meat', categoryId: 'seafood', icon: '🥬', nameJa: '野菜と肉の炒め', nameZh: '蔬菜炒肉', nameEn: 'Vegetable and meat stir-fry', price: 780, desc: '写真掲載の料理。', recommended: false, soldOut: false },
      { id: 'shrimp-chili-egg', categoryId: 'seafood', icon: '🍤', nameJa: 'エビ玉子チリソース', nameZh: '虾仁鸡蛋辣酱', nameEn: 'Shrimp egg chili sauce', price: 890, desc: '店頭定食にもある海鮮料理。', recommended: true, soldOut: false },
      { id: 'whitefish-sweet-sour', categoryId: 'seafood', icon: '🐟', nameJa: '白身魚の甘酢炒め', nameZh: '糖醋白身鱼', nameEn: 'Sweet and sour white fish', price: 890, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'seafood-tofu-stew', categoryId: 'seafood', icon: '🦐', nameJa: '海鮮と豆腐煮込み', nameZh: '海鲜豆腐煲', nameEn: 'Seafood tofu stew', price: 980, desc: '写真掲載のあんかけ煮込み。', recommended: false, soldOut: false },
      { id: 'broccoli-stir', categoryId: 'seafood', icon: '🥦', nameJa: 'ブロッコリー炒め', nameZh: '炒西兰花', nameEn: 'Stir-fried broccoli', price: 680, desc: '写真掲載の野菜料理。', recommended: false, soldOut: false },
      { id: 'fried-chicken-cartilage', categoryId: 'fried', icon: '🍗', nameJa: '鶏軟骨の揚げ', nameZh: '炸鸡软骨', nameEn: 'Fried chicken cartilage', price: 480, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'fried-liver', categoryId: 'fried', icon: '🍗', nameJa: '揚げレバー', nameZh: '炸猪肝', nameEn: 'Fried liver', price: 580, desc: '写真掲載の揚げ物。', recommended: false, soldOut: false },
      { id: 'fried-river-shrimp', categoryId: 'fried', icon: '🦐', nameJa: '揚げ川エビ', nameZh: '炸河虾', nameEn: 'Fried river shrimp', price: 580, desc: '写真掲載の揚げ物。', recommended: false, soldOut: false },
      { id: 'potato-fries', categoryId: 'fried', icon: '🍟', nameJa: 'ポテトフライ', nameZh: '炸薯条', nameEn: 'French fries', price: 380, desc: '晩酌セット写真掲載。', recommended: false, soldOut: false },
      { id: 'draft-beer', categoryId: 'drink', icon: '🍺', nameJa: '生ビール', nameZh: '生啤', nameEn: 'Draft beer', price: 500, desc: '晩酌セット対象ドリンク。', recommended: true, soldOut: false },
      { id: 'sour', categoryId: 'drink', icon: '🍋', nameJa: 'サワー', nameZh: '沙瓦', nameEn: 'Sour cocktail', price: 450, desc: '晩酌セット対象ドリンク。', recommended: false, soldOut: false },
      { id: 'highball', categoryId: 'drink', icon: '🥃', nameJa: 'ハイボール', nameZh: '嗨棒', nameEn: 'Highball', price: 450, desc: '晩酌セット対象ドリンク。', recommended: false, soldOut: false },
      { id: 'shochu', categoryId: 'drink', icon: '🍶', nameJa: '焼酎', nameZh: '烧酒', nameEn: 'Shochu', price: 450, desc: '晩酌セット対象ドリンク。', recommended: false, soldOut: false },
      { id: 'soft-drink', categoryId: 'drink', icon: '🥤', nameJa: 'ソフトドリンク', nameZh: '软饮', nameEn: 'Soft drink', price: 300, desc: '晩酌セット対象ドリンク。', recommended: false, soldOut: false }
    ],
    tables: [
      { id: '1', area: 'A', seats: 2, status: 'available' },
      { id: '2', area: 'A', seats: 4, status: 'available' },
      { id: '3', area: 'B', seats: 4, status: 'available' },
      { id: '4', area: 'B', seats: 4, status: 'available' },
      { id: '5', area: '座敷', seats: 6, status: 'available' },
      { id: '6', area: '座敷', seats: 8, status: 'available' },
      { id: '7', area: '宴会', seats: 10, status: 'available' }
    ],
    orders: []
  };

  function memoryStorage() {
    const data = {};
    return {
      getItem: (key) => Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null,
      setItem: (key, value) => { data[key] = String(value); },
      removeItem: (key) => { delete data[key]; }
    };
  }

  function cookieStorage() {
    return {
      getItem: (key) => {
        const pair = (root.document.cookie || '').split('; ').find((entry) => entry.startsWith(encodeURIComponent(key) + '='));
        return pair ? decodeURIComponent(pair.split('=').slice(1).join('=')) : null;
      },
      setItem: (key, value) => {
        root.document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}; path=/; max-age=2592000; SameSite=Lax`;
      },
      removeItem: (key) => {
        root.document.cookie = `${encodeURIComponent(key)}=; path=/; max-age=0; SameSite=Lax`;
      },
      keys: () => (root.document.cookie || '').split('; ').filter(Boolean).map((entry) => decodeURIComponent(entry.split('=')[0]))
    };
  }

  function storage() {
    try {
      if (root.localStorage) return root.localStorage;
    } catch (error) {}
    if (root.document && typeof root.document.cookie === 'string') return cookieStorage();
    return (root.__irakutechMemoryStorage ||= memoryStorage());
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadStore() {
    const raw = storage().getItem(STORE_KEY);
    if (!raw) {
      const initial = clone(seed);
      saveStore(initial);
      return initial;
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        restaurant: parsed.restaurant || clone(seed.restaurant),
        settings: parsed.settings || clone(seed.settings),
        categories: parsed.categories || clone(seed.categories),
        menu: parsed.menu || clone(seed.menu),
        tables: parsed.tables || clone(seed.tables),
        orders: parsed.orders || []
      };
    } catch (error) {
      const initial = clone(seed);
      saveStore(initial);
      return initial;
    }
  }

  function saveStore(store) {
    storage().setItem(STORE_KEY, JSON.stringify(store));
    return store;
  }

  function cartKey(tableId) {
    return CART_PREFIX + tableId;
  }

  function loadCart(tableId) {
    const raw = storage().getItem(cartKey(tableId));
    return raw ? JSON.parse(raw) : [];
  }

  function saveCart(tableId, cart) {
    storage().setItem(cartKey(tableId), JSON.stringify(cart));
    return cart;
  }

  function clearCart(tableId) {
    storage().removeItem(cartKey(tableId));
  }

  function addToCart(tableId, menuItemId) {
    const store = loadStore();
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item || item.soldOut) return loadCart(tableId);
    const cart = loadCart(tableId);
    const existing = cart.find((line) => line.menuItemId === menuItemId);
    if (existing) existing.quantity += 1;
    else cart.push({ menuItemId, quantity: 1, note: '' });
    return saveCart(tableId, cart);
  }

  function updateCartLine(tableId, menuItemId, changes) {
    const cart = loadCart(tableId).map((line) => {
      if (line.menuItemId !== menuItemId) return line;
      return { ...line, ...changes, quantity: Number(changes.quantity ?? line.quantity) };
    }).filter((line) => line.quantity > 0);
    return saveCart(tableId, cart);
  }

  function cartTotal(cart, menu) {
    return cart.reduce((sum, line) => {
      const item = menu.find((entry) => entry.id === line.menuItemId);
      return sum + (item ? item.price * line.quantity : 0);
    }, 0);
  }

  function availablePaymentMethods(store = loadStore()) {
    const methods = store.settings?.paymentMethods || seed.settings.paymentMethods;
    return methods.filter((method) => method.enabled);
  }

  function tableOrderUrl(baseUrl, tableId) {
    const normalized = String(baseUrl || '').replace(/\/+$/, '');
    return `${normalized}/order/?table=${encodeURIComponent(String(tableId))}`;
  }

  function createOrder({ tableId, cart }) {
    const store = loadStore();
    if (!cart || cart.length === 0) throw new Error('Cart is empty');
    const lines = cart.map((line, index) => {
      const item = store.menu.find((entry) => entry.id === line.menuItemId);
      if (!item || item.soldOut) throw new Error('Menu item unavailable');
      return {
        id: `${item.id}-${Date.now()}-${index}`,
        menuItemId: item.id,
        nameJa: item.nameJa,
        nameZh: item.nameZh,
        nameEn: item.nameEn,
        price: item.price,
        quantity: line.quantity,
        status: 'new',
        note: line.note || ''
      };
    });
    const order = {
      id: 'ORD-' + Date.now(),
      tableId: String(tableId),
      status: 'new',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      lines,
      total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
    };
    store.orders.unshift(order);
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'occupied' } : table);
    saveStore(store);
    clearCart(tableId);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    const store = loadStore();
    store.orders = store.orders.map((order) => order.id === orderId ? { ...order, status } : order);
    saveStore(store);
  }

  function kitchenUrgency(waitMinutes) {
    if (waitMinutes >= 10) return 'urgent';
    if (waitMinutes >= 5) return 'warning';
    return 'normal';
  }

  function kitchenQueueItems(now = new Date()) {
    const store = loadStore();
    return store.orders
      .filter((order) => order.paymentStatus !== 'paid' && order.status !== 'canceled')
      .flatMap((order) => order.lines.map((line) => ({
        ...line,
        orderId: order.id,
        tableId: order.tableId,
        createdAt: order.createdAt,
        orderStatus: order.status,
        waitMinutes: Math.max(0, Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / 60000)),
        urgency: kitchenUrgency(Math.max(0, Math.floor((now.getTime() - new Date(order.createdAt).getTime()) / 60000)))
      })))
      .filter((line) => line.status !== 'done' && line.status !== 'canceled')
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  function updateOrderLineStatus(orderId, lineId, status) {
    const store = loadStore();
    let updatedLine;
    store.orders = store.orders.map((order) => {
      if (order.id !== orderId) return order;
      const lines = order.lines.map((line) => {
        if (line.id !== lineId) return line;
        updatedLine = { ...line, status };
        return updatedLine;
      });
      const allDone = lines.length > 0 && lines.every((line) => line.status === 'done');
      return { ...order, lines, status: allDone ? 'done' : order.status };
    });
    if (!updatedLine) throw new Error('Order line not found');
    saveStore(store);
    return updatedLine;
  }

  function hasOpenOrdersForTable(store, tableId) {
    return store.orders.some((order) => order.tableId === String(tableId) && order.paymentStatus !== 'paid' && order.status !== 'canceled');
  }

  function cancelOrder(orderId, reason = '') {
    const store = loadStore();
    let canceledOrder;
    store.orders = store.orders.map((order) => {
      if (order.id !== orderId) return order;
      canceledOrder = {
        ...order,
        status: 'canceled',
        paymentStatus: 'canceled',
        cancelReason: reason,
        canceledAt: new Date().toISOString()
      };
      return canceledOrder;
    });
    if (!canceledOrder) throw new Error('Order not found');
    store.tables = store.tables.map((table) => (
      table.id === String(canceledOrder.tableId) && !hasOpenOrdersForTable(store, table.id)
        ? { ...table, status: 'available' }
        : table
    ));
    saveStore(store);
    return canceledOrder;
  }

  function checkoutTable(tableId, paymentMethod) {
    const store = loadStore();
    if (!availablePaymentMethods(store).some((method) => method.id === paymentMethod)) {
      throw new Error('Payment method unavailable');
    }
    let paidTotal = 0;
    store.orders = store.orders.map((order) => {
      if (order.tableId !== String(tableId) || order.paymentStatus === 'paid' || order.status === 'canceled') return order;
      paidTotal += order.total;
      return { ...order, status: 'paid', paymentStatus: 'paid', paymentMethod, paidAt: new Date().toISOString() };
    });
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'available' } : table);
    saveStore(store);
    return paidTotal;
  }

  function dailySummary(date = new Date()) {
    const day = date.toISOString().slice(0, 10);
    const store = loadStore();
    const todaysOrders = store.orders.filter((order) => order.createdAt?.slice(0, 10) === day);
    const paidOrders = todaysOrders.filter((order) => order.paymentStatus === 'paid');
    const unpaidOrders = todaysOrders.filter((order) => order.paymentStatus === 'unpaid' && order.status !== 'canceled');
    const itemMap = new Map();
    paidOrders.forEach((order) => {
      order.lines.forEach((line) => {
        const current = itemMap.get(line.menuItemId) || {
          menuItemId: line.menuItemId,
          nameJa: line.nameJa,
          nameZh: line.nameZh,
          nameEn: line.nameEn,
          quantity: 0,
          total: 0
        };
        current.quantity += line.quantity;
        current.total += line.price * line.quantity;
        itemMap.set(line.menuItemId, current);
      });
    });
    return {
      date: day,
      orderCount: paidOrders.length,
      canceledCount: todaysOrders.filter((order) => order.status === 'canceled').length,
      paidTotal: paidOrders.reduce((sum, order) => sum + order.total, 0),
      unpaidTotal: unpaidOrders.reduce((sum, order) => sum + order.total, 0),
      topItems: Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity)
    };
  }

  function upsertMenuItem(item) {
    const store = loadStore();
    const normalized = { ...item, price: Number(item.price), soldOut: Boolean(item.soldOut), recommended: Boolean(item.recommended) };
    const index = store.menu.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.menu[index] = normalized;
    else store.menu.push(normalized);
    saveStore(store);
    return normalized;
  }

  function toggleSoldOut(menuItemId) {
    const store = loadStore();
    store.menu = store.menu.map((item) => item.id === menuItemId ? { ...item, soldOut: !item.soldOut } : item);
    saveStore(store);
  }

  function resetDemo() {
    saveStore(clone(seed));
    const keys = storage().keys ? storage().keys() : Object.keys(storage());
    keys.forEach?.((key) => {
      if (key.startsWith(CART_PREFIX)) storage().removeItem(key);
    });
  }

  const api = {
    STORE_KEY,
    seed,
    loadStore,
    saveStore,
    loadCart,
    saveCart,
    addToCart,
    updateCartLine,
    cartTotal,
    availablePaymentMethods,
    tableOrderUrl,
    createOrder,
    updateOrderStatus,
    kitchenUrgency,
    kitchenQueueItems,
    updateOrderLineStatus,
    cancelOrder,
    checkoutTable,
    dailySummary,
    upsertMenuItem,
    toggleSoldOut,
    resetDemo
  };

  root.IzakayaCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
