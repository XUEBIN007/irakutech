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
    inventory: [
    ],
    inventoryMovements: [],
    tables: [
      { id: '1', area: 'A', seats: 2, status: 'available', enabled: true, token: 'A1HONCHO' },
      { id: '2', area: 'A', seats: 4, status: 'available', enabled: true, token: 'A2HONCHO' },
      { id: '3', area: 'B', seats: 4, status: 'available', enabled: true, token: 'B3HONCHO' },
      { id: '4', area: 'B', seats: 4, status: 'available', enabled: true, token: 'B4HONCHO' },
      { id: '5', area: '座敷', seats: 6, status: 'available', enabled: true, token: 'Z5HONCHO' },
      { id: '6', area: '座敷', seats: 8, status: 'available', enabled: true, token: 'Z6HONCHO' },
      { id: '7', area: '宴会', seats: 10, status: 'available', enabled: true, token: 'P7HONCHO' }
    ],
    staff: [
      { id: 'owner', name: '店長', role: 'manager', active: true, hourlyWage: 1500 },
      { id: 'kitchen-a', name: '厨房A', role: 'kitchen', active: true, hourlyWage: 1200 }
    ],
    staffSchedules: [],
    timeEntries: [],
    dailyCloses: [],
    tableEvents: [],
    customerNotes: [],
    auditEvents: [],
    orders: []
  };
  seed.inventory = seed.menu.map((item) => ({
    menuItemId: item.id,
    stock: item.categoryId === 'course' ? 200 : 80,
    safetyStock: item.categoryId === 'course' ? 20 : 10
  }));

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

  function demoAutoRestockEnabled() {
    return root.IzakayaCloudConfig?.demoAutoRestock === true;
  }

  function restoreDemoInventory(store) {
    if (!demoAutoRestockEnabled()) return false;
    let changed = false;
    const seedStock = new Map(seed.inventory.map((entry) => [entry.menuItemId, entry.stock]));
    store.inventory.forEach((entry) => {
      const targetStock = seedStock.get(entry.menuItemId) ?? Math.max(entry.safetyStock * 3, 12);
      const item = store.menu.find((menuItem) => menuItem.id === entry.menuItemId);
      if (entry.stock <= entry.safetyStock || item?.soldOut) {
        entry.stock = Math.max(entry.stock, targetStock);
        if (item) item.soldOut = false;
        changed = true;
      }
    });
    return changed;
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
      const normalized = {
        restaurant: parsed.restaurant || clone(seed.restaurant),
        settings: parsed.settings || clone(seed.settings),
        categories: parsed.categories || clone(seed.categories),
        menu: parsed.menu || clone(seed.menu),
        inventory: normalizeInventory(parsed.inventory, parsed.menu || seed.menu),
        inventoryMovements: (parsed.inventoryMovements || []).map(normalizeInventoryMovement),
        tables: normalizeTables(parsed.tables || clone(seed.tables)),
        staff: normalizeStaff(parsed.staff || clone(seed.staff)),
        staffSchedules: (parsed.staffSchedules || []).map(normalizeStaffSchedule),
        timeEntries: (parsed.timeEntries || []).map(normalizeTimeEntry),
        dailyCloses: (parsed.dailyCloses || []).map(normalizeDailyClose),
        tableEvents: (parsed.tableEvents || []).map(normalizeTableEvent),
        customerNotes: (parsed.customerNotes || []).map(normalizeCustomerNote),
        auditEvents: (parsed.auditEvents || []).map(normalizeAuditEvent),
        orders: (parsed.orders || []).map(normalizeOrder)
      };
      if (restoreDemoInventory(normalized)) saveStore(normalized);
      return normalized;
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

  function randomToken() {
    if (root.crypto?.getRandomValues) {
      const bytes = new Uint8Array(6);
      root.crypto.getRandomValues(bytes);
      return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return Math.random().toString(36).slice(2, 10).toUpperCase() + Date.now().toString(36).slice(-4).toUpperCase();
  }

  function normalizeTables(tables) {
    return tables.map((table) => ({
      id: String(table.id),
      area: table.area || 'A',
      seats: Number(table.seats || 2),
      status: table.status || 'available',
      enabled: table.enabled !== false,
      token: table.token || randomToken(),
      guestCount: Number(table.guestCount || 0),
      openedAt: table.openedAt || '',
      note: table.note || '',
      checkoutRequestedAt: table.checkoutRequestedAt || '',
      checkoutNote: table.checkoutNote || ''
    }));
  }

  function normalizeTableEvent(event) {
    return {
      id: event.id || 'TABLE-' + randomToken(),
      type: event.type,
      tableId: event.tableId ? String(event.tableId) : '',
      fromTableId: event.fromTableId ? String(event.fromTableId) : '',
      toTableId: event.toTableId ? String(event.toTableId) : '',
      guestCount: Number(event.guestCount || 0),
      note: event.note || '',
      source: event.source || 'staff',
      reason: event.reason || '',
      resolvedAt: event.resolvedAt || '',
      resolvedBy: event.resolvedBy || '',
      createdAt: event.createdAt || new Date().toISOString()
    };
  }

  function addTableEvent(store, event) {
    const normalized = normalizeTableEvent({
      id: 'TABLE-' + Date.now() + '-' + randomToken().slice(0, 4),
      createdAt: new Date().toISOString(),
      ...event
    });
    store.tableEvents.unshift(normalized);
    return normalized;
  }

  function normalizeAuditEvent(event) {
    return {
      id: event.id || 'AUDIT-' + randomToken(),
      createdAt: event.createdAt || new Date().toISOString(),
      module: event.module || 'system',
      action: event.action || 'update',
      actor: event.actor || 'system',
      target: event.target ? String(event.target) : '',
      summary: event.summary || '',
      amount: Number(event.amount || 0),
      quantity: Number(event.quantity || 0),
      meta: event.meta && typeof event.meta === 'object' ? event.meta : {}
    };
  }

  function addAuditEvent(store, event) {
    const normalized = normalizeAuditEvent({
      id: 'AUDIT-' + Date.now() + '-' + randomToken().slice(0, 4),
      createdAt: new Date().toISOString(),
      ...event
    });
    store.auditEvents = [normalized, ...(store.auditEvents || [])].slice(0, 300);
    return normalized;
  }

  function normalizeInventory(inventory, menu) {
    const byId = new Map((inventory || []).map((entry) => [entry.menuItemId, entry]));
    return menu.map((item) => {
      const entry = byId.get(item.id) || {};
      return {
        menuItemId: item.id,
        stock: Number(entry.stock ?? 0),
        safetyStock: Number(entry.safetyStock ?? 0)
      };
    });
  }

  function normalizeInventoryMovement(entry) {
    return {
      id: entry.id || 'INV-' + randomToken(),
      menuItemId: String(entry.menuItemId),
      type: entry.type || 'adjustment',
      quantity: Number(entry.quantity || 0),
      stockAfter: Number(entry.stockAfter || 0),
      note: entry.note || '',
      orderId: entry.orderId || '',
      createdAt: entry.createdAt || new Date().toISOString()
    };
  }

  function movementDelta(type, quantity) {
    const value = Math.abs(Number(quantity || 0));
    if (type === 'sale' || type === 'waste') return -value;
    return value;
  }

  function setMenuSoldOutByStock(store, menuItemId, stock) {
    store.menu = store.menu.map((item) => item.id === menuItemId ? { ...item, soldOut: stock <= 0 } : item);
  }

  function addInventoryMovement(store, menuItemId, movement) {
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item) throw new Error('Menu item not found');
    let inventoryItem = store.inventory.find((entry) => entry.menuItemId === menuItemId);
    if (!inventoryItem) {
      inventoryItem = { menuItemId, stock: 0, safetyStock: 0 };
      store.inventory.push(inventoryItem);
    }
    const type = movement.type || 'adjustment';
    const delta = movementDelta(type, movement.quantity);
    const nextStock = Math.max(0, inventoryItem.stock + delta);
    inventoryItem.stock = nextStock;
    setMenuSoldOutByStock(store, menuItemId, nextStock);
    const entry = normalizeInventoryMovement({
      id: 'INV-' + Date.now() + '-' + randomToken().slice(0, 4),
      menuItemId,
      type,
      quantity: delta,
      stockAfter: nextStock,
      note: movement.note || '',
      orderId: movement.orderId || '',
      createdAt: movement.createdAt || new Date().toISOString()
    });
    store.inventoryMovements.unshift(entry);
    return entry;
  }

  function normalizeStaff(staff) {
    return staff.map((entry) => ({
      id: String(entry.id).trim(),
      name: String(entry.name || '').trim(),
      role: entry.role || 'staff',
      active: entry.active !== false,
      hourlyWage: Number(entry.hourlyWage || 0)
    })).filter((entry) => entry.id && entry.name);
  }

  function normalizeStaffSchedule(schedule) {
    return {
      id: schedule.id || `${schedule.staffId}-${schedule.date}`,
      staffId: String(schedule.staffId),
      date: schedule.date,
      startTime: schedule.startTime || '09:00',
      endTime: schedule.endTime || '17:00',
      breakMinutes: Number(schedule.breakMinutes || 0),
      note: schedule.note || ''
    };
  }

  function normalizeTimeEntry(entry) {
    return {
      id: entry.id || 'TIME-' + randomToken(),
      staffId: String(entry.staffId),
      clockIn: entry.clockIn,
      clockOut: entry.clockOut || '',
      breakStartedAt: entry.breakStartedAt || '',
      breakMinutes: Number(entry.breakMinutes || 0),
      status: entry.status || (entry.clockOut ? 'done' : 'working')
    };
  }

  function normalizeDailyClose(entry) {
    return {
      id: entry.id || 'CLOSE-' + randomToken(),
      date: entry.date,
      cashExpected: Number(entry.cashExpected || 0),
      cashActual: Number(entry.cashActual || 0),
      cashDifference: Number(entry.cashDifference || 0),
      salesTotal: Number(entry.salesTotal || 0),
      openTotal: Number(entry.openTotal || 0),
      paymentMethods: entry.paymentMethods || {},
      note: entry.note || '',
      closedAt: entry.closedAt || new Date().toISOString()
    };
  }

  function normalizePhone(phone) {
    return String(phone || '').replace(/[^\d]/g, '');
  }

  function normalizeCustomerNote(entry) {
    return {
      phone: normalizePhone(entry.phone),
      note: entry.note || '',
      updatedAt: entry.updatedAt || new Date().toISOString()
    };
  }

  function normalizeOrder(order) {
    const orderType = order.orderType || (order.tableId ? 'dine-in' : 'pickup');
    const deliveryFee = Number(order.deliveryFee || 0);
    const subtotal = Number(order.subtotal ?? order.total ?? 0) - (order.subtotal === undefined && deliveryFee ? deliveryFee : 0);
    const normalized = {
      ...order,
      tableId: order.tableId ? String(order.tableId) : '',
      orderType,
      customer: {
        name: order.customer?.name || '',
        phone: order.customer?.phone || ''
      },
      fulfillment: {
        method: order.fulfillment?.method || orderType,
        requestedAt: order.fulfillment?.requestedAt || '',
        address: order.fulfillment?.address || '',
        note: order.fulfillment?.note || ''
      },
      fulfillmentStatus: order.fulfillmentStatus || 'pending',
      subtotal,
      deliveryFee,
      total: Number(order.total ?? subtotal + deliveryFee)
    };
    normalized.lines = (order.lines || []).map((line, index) => ({
      id: line.id || `${line.menuItemId || 'line'}-${order.id || 'order'}-${index}`,
      status: line.status || (order.status === 'done' ? 'done' : 'new'),
      ...line,
      nameEn: line.nameEn || ''
    }));
    return normalized;
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

  function orderTypeTextForAudit(orderType) {
    if (orderType === 'pickup') return 'Pickup';
    if (orderType === 'delivery') return 'Delivery';
    return 'Dine-in';
  }

  function orderLabelForAudit(order) {
    if (order.orderType === 'pickup') return `Pickup ${order.customer?.name || order.id}`.trim();
    if (order.orderType === 'delivery') return `Delivery ${order.customer?.name || order.id}`.trim();
    return `Table ${order.tableId || '-'} ${order.id}`;
  }

  function createOrder({ tableId = '', cart, orderType, customer, fulfillment, deliveryFee = 0 }) {
    const store = loadStore();
    if (!cart || cart.length === 0) throw new Error('Cart is empty');
    const normalizedOrderType = orderType || (tableId ? 'dine-in' : 'pickup');
    const normalizedDeliveryFee = Number(deliveryFee || 0);
    const lines = cart.map((line, index) => {
      const item = store.menu.find((entry) => entry.id === line.menuItemId);
      const inventoryItem = store.inventory.find((entry) => entry.menuItemId === line.menuItemId);
      const quantity = Number(line.quantity || 0);
      if (!item || item.soldOut || quantity <= 0 || (inventoryItem && inventoryItem.stock < quantity)) throw new Error('Menu item unavailable');
      return {
        id: `${item.id}-${Date.now()}-${index}`,
        menuItemId: item.id,
        nameJa: item.nameJa,
        nameZh: item.nameZh,
        nameEn: item.nameEn || '',
        price: item.price,
        quantity,
        status: 'new',
        note: line.note || ''
      };
    });
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const order = {
      id: 'ORD-' + Date.now() + '-' + randomToken().slice(0, 4),
      tableId: tableId ? String(tableId) : '',
      orderType: normalizedOrderType,
      customer: {
        name: customer?.name || '',
        phone: customer?.phone || ''
      },
      fulfillment: {
        method: fulfillment?.method || normalizedOrderType,
        requestedAt: fulfillment?.requestedAt || '',
        address: fulfillment?.address || '',
        note: fulfillment?.note || ''
      },
      fulfillmentStatus: 'pending',
      status: 'new',
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
      lines,
      subtotal,
      deliveryFee: normalizedDeliveryFee,
      total: subtotal + normalizedDeliveryFee
    };
    lines.forEach((line) => {
      const inventoryItem = store.inventory.find((entry) => entry.menuItemId === line.menuItemId);
      if (!inventoryItem) return;
      addInventoryMovement(store, line.menuItemId, {
        type: 'sale',
        quantity: line.quantity,
        orderId: order.id,
        note: order.tableId ? `Table ${order.tableId}` : order.orderType
      });
    });
    store.orders.unshift(order);
    if (normalizedOrderType === 'dine-in' && tableId) {
      store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, status: 'occupied', openedAt: table.openedAt || order.createdAt } : table);
    }
    addAuditEvent(store, {
      module: 'order',
      action: 'create_order',
      actor: normalizedOrderType === 'dine-in' ? '顾客' : '顾客',
      target: order.id,
      summary: `${orderTypeTextForAudit(normalizedOrderType)} ${order.tableId ? `Table ${order.tableId}` : order.customer.name || ''}`.trim(),
      amount: order.total,
      quantity: lines.reduce((sum, line) => sum + line.quantity, 0),
      meta: { orderType: normalizedOrderType, tableId: order.tableId }
    });
    saveStore(store);
    if (tableId) clearCart(tableId);
    return order;
  }

  function updateOrderStatus(orderId, status) {
    const store = loadStore();
    const order = store.orders.find((entry) => entry.id === orderId);
    store.orders = store.orders.map((order) => order.id === orderId ? { ...order, status } : order);
    if (order) addAuditEvent(store, {
      module: 'kitchen',
      action: 'update_order_status',
      actor: '厨房',
      target: orderId,
      summary: `${orderLabelForAudit(order)} -> ${status}`,
      amount: order.total,
      quantity: order.lines.reduce((sum, line) => sum + line.quantity, 0),
      meta: { status }
    });
    saveStore(store);
  }

  function cancelOrder(orderId, reason = '') {
    const store = loadStore();
    const order = store.orders.find((entry) => entry.id === orderId);
    if (!order || order.paymentStatus === 'paid') return null;
    store.orders = store.orders.map((entry) => entry.id === orderId ? {
      ...entry,
      status: 'canceled',
      paymentStatus: 'canceled',
      cancelReason: reason,
      canceledAt: new Date().toISOString(),
      lines: entry.lines.map((line) => ({ ...line, status: 'canceled' }))
    } : entry);
    if (order.tableId) {
      const hasRemaining = store.orders.some((entry) => entry.id !== orderId && entry.tableId === order.tableId && entry.paymentStatus !== 'paid' && entry.paymentStatus !== 'canceled');
      if (!hasRemaining) store.tables = store.tables.map((table) => table.id === order.tableId ? resetTableState(table) : table);
    }
    addAuditEvent(store, {
      module: 'order',
      action: 'cancel_order',
      actor: '店长',
      target: orderId,
      summary: `${orderLabelForAudit(order)} canceled`,
      amount: order.total,
      quantity: order.lines.reduce((sum, line) => sum + line.quantity, 0),
      meta: { reason }
    });
    saveStore(store);
    return store.orders.find((entry) => entry.id === orderId);
  }

  function tableOpenSummary(tableId) {
    const orders = loadStore().orders.filter((order) => (
      order.tableId === String(tableId) && order.paymentStatus !== 'paid'
    ));
    return {
      tableId: String(tableId),
      orders,
      total: orders.reduce((sum, order) => sum + order.total, 0)
    };
  }

  function tableOrderProgress(tableId) {
    const orders = loadStore().orders.filter((order) => (
      order.tableId === String(tableId) && order.paymentStatus !== 'paid' && order.paymentStatus !== 'canceled'
    ));
    const lines = orders.flatMap((order) => order.lines);
    const totalQuantity = lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0);
    const doneQuantity = lines
      .filter((line) => line.status === 'done')
      .reduce((sum, line) => sum + Number(line.quantity || 0), 0);
    const openQuantity = Math.max(totalQuantity - doneQuantity, 0);
    return {
      tableId: String(tableId),
      orderCount: orders.length,
      totalQuantity,
      doneQuantity,
      openQuantity,
      ready: totalQuantity > 0 && openQuantity === 0
    };
  }

  function tableRecentCheckout(tableId) {
    const paidOrders = loadStore().orders
      .filter((order) => order.tableId === String(tableId) && order.paymentStatus === 'paid')
      .sort((a, b) => String(b.paidAt || '').localeCompare(String(a.paidAt || '')));
    if (!paidOrders.length) {
      return { tableId: String(tableId), orders: [], orderCount: 0, total: 0, paidAt: '' };
    }
    const latestPaidAt = paidOrders[0].paidAt || '';
    const orders = paidOrders.filter((order) => order.paidAt === latestPaidAt);
    return {
      tableId: String(tableId),
      orders,
      orderCount: orders.length,
      total: orders.reduce((sum, order) => sum + order.total, 0),
      paidAt: latestPaidAt
    };
  }

  function kitchenOrderGroups() {
    const groups = { new: [], preparing: [], done: [] };
    loadStore().orders
      .filter((order) => order.paymentStatus !== 'paid' && order.paymentStatus !== 'canceled')
      .forEach((order) => {
        const status = groups[order.status] ? order.status : 'new';
        groups[status].push(order);
      });
    return groups;
  }

  function kitchenUrgency(minutes) {
    if (minutes >= 10) return 'urgent';
    if (minutes >= 5) return 'warning';
    return 'normal';
  }

  function kitchenQueueItems(now = new Date()) {
    const current = new Date(now).getTime();
    return loadStore().orders
      .filter((order) => order.paymentStatus !== 'paid' && order.paymentStatus !== 'canceled')
      .flatMap((order) => order.lines
        .filter((line) => line.status !== 'done' && line.status !== 'canceled')
        .map((line) => {
          const minutes = Math.max(0, Math.floor((current - new Date(order.createdAt).getTime()) / 60000));
          return {
            orderId: order.id,
            tableId: order.tableId,
            orderType: order.orderType,
            customer: order.customer,
            fulfillment: order.fulfillment,
            createdAt: order.createdAt,
            minutes,
            waitMinutes: minutes,
            urgency: kitchenUrgency(minutes),
            ...line,
            line
          };
        }))
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  function updateOrderLineStatus(orderId, lineId, status) {
    const store = loadStore();
    const order = store.orders.find((entry) => entry.id === orderId);
    if (!order) return null;
    let updatedLine = null;
    const updatedLines = order.lines.map((line) => {
      if (line.id !== lineId) return line;
      updatedLine = { ...line, status };
      return updatedLine;
    });
    const orderStatus = updatedLines.every((line) => line.status === 'done') ? 'done' : 'preparing';
    store.orders = store.orders.map((entry) => entry.id === orderId ? { ...entry, lines: updatedLines, status: orderStatus } : entry);
    addAuditEvent(store, {
      module: 'kitchen',
      action: 'update_order_line_status',
      actor: '厨房',
      target: `${orderId}/${lineId}`,
      summary: `${orderLabelForAudit(order)} line -> ${status}`,
      meta: { status }
    });
    saveStore(store);
    return updatedLine;
  }

  function checkoutTable(tableId, payment) {
    const store = loadStore();
    const paymentInfo = typeof payment === 'string' ? { method: payment } : (payment || {});
    const method = paymentInfo.method || 'cash';
    const enabledMethods = availablePaymentMethods(store).map((entry) => entry.id);
    if (enabledMethods.length && !enabledMethods.includes(method)) throw new Error('Payment method unavailable');
    const unpaidOrders = store.orders.filter((order) => order.tableId === String(tableId) && order.paymentStatus !== 'paid' && order.paymentStatus !== 'canceled');
    const paidTotal = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
    const hasReceived = paymentInfo.receivedAmount !== undefined && paymentInfo.receivedAmount !== null && paymentInfo.receivedAmount !== '';
    const receivedAmount = hasReceived ? Number(paymentInfo.receivedAmount) : paidTotal;
    const changeAmount = Math.max(receivedAmount - paidTotal, 0);
    store.orders = store.orders.map((order) => {
      if (order.tableId !== String(tableId) || order.paymentStatus === 'paid' || order.paymentStatus === 'canceled') return order;
      return {
        ...order,
        status: 'paid',
        paymentStatus: 'paid',
        paymentMethod: method,
        receivedAmount,
        changeAmount,
        paidAt: new Date().toISOString()
      };
    });
    store.tables = store.tables.map((table) => table.id === String(tableId) ? resetTableState(table) : table);
    if (paidTotal > 0) addAuditEvent(store, {
      module: 'checkout',
      action: 'checkout_table',
      actor: '会计',
      target: tableId,
      summary: `Table ${tableId} checkout`,
      amount: paidTotal,
      quantity: unpaidOrders.length,
      meta: { method, receivedAmount, changeAmount }
    });
    saveStore(store);
    return paidTotal;
  }

  function checkoutOrder(orderId, payment) {
    const store = loadStore();
    const order = store.orders.find((entry) => entry.id === orderId && entry.paymentStatus !== 'paid' && entry.paymentStatus !== 'canceled');
    if (!order) return 0;
    const paymentInfo = typeof payment === 'string' ? { method: payment } : (payment || {});
    const method = paymentInfo.method || 'cash';
    const enabledMethods = availablePaymentMethods(store).map((entry) => entry.id);
    if (enabledMethods.length && !enabledMethods.includes(method)) throw new Error('Payment method unavailable');
    const hasReceived = paymentInfo.receivedAmount !== undefined && paymentInfo.receivedAmount !== null && paymentInfo.receivedAmount !== '';
    const receivedAmount = hasReceived ? Number(paymentInfo.receivedAmount) : order.total;
    const changeAmount = Math.max(receivedAmount - order.total, 0);
    store.orders = store.orders.map((entry) => entry.id === orderId ? {
      ...entry,
      status: 'paid',
      paymentStatus: 'paid',
      paymentMethod: method,
      receivedAmount,
      changeAmount,
      paidAt: new Date().toISOString()
    } : entry);
    addAuditEvent(store, {
      module: 'checkout',
      action: 'checkout_order',
      actor: '会计',
      target: orderId,
      summary: `${orderLabelForAudit(order)} checkout`,
      amount: order.total,
      quantity: 1,
      meta: { method, receivedAmount, changeAmount }
    });
    saveStore(store);
    return order.total;
  }

  function paymentHistory() {
    const records = loadStore().orders
      .filter((order) => order.paymentStatus === 'paid')
      .map((order) => ({
        orderId: order.id,
        tableId: order.tableId,
        orderType: order.orderType,
        customer: order.customer,
        fulfillment: order.fulfillment,
        method: order.paymentMethod || 'cash',
        total: order.total,
        receivedAmount: order.receivedAmount ?? order.total,
        changeAmount: order.changeAmount || 0,
        paidAt: order.paidAt,
        lines: order.lines
      }))
      .sort((a, b) => String(b.paidAt || '').localeCompare(String(a.paidAt || '')));
    return {
      records,
      total: records.reduce((sum, record) => sum + record.total, 0)
    };
  }

  function businessOverview(now = new Date()) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const todayOrders = loadStore().orders.filter((order) => {
      const createdAt = new Date(order.createdAt);
      return createdAt >= start && createdAt < end;
    });
    const activeOrders = todayOrders.filter((order) => order.paymentStatus !== 'canceled');
    const canceledOrders = todayOrders.filter((order) => order.paymentStatus === 'canceled');
    const openOrders = activeOrders.filter((order) => order.paymentStatus !== 'paid');
    const paidOrders = activeOrders.filter((order) => order.paymentStatus === 'paid');
    const byType = { dineIn: 0, pickup: 0, delivery: 0 };
    activeOrders.forEach((order) => {
      if (order.orderType === 'pickup') byType.pickup += 1;
      else if (order.orderType === 'delivery') byType.delivery += 1;
      else byType.dineIn += 1;
    });
    return {
      date: dateKey(start),
      orderCount: activeOrders.length,
      paidCount: paidOrders.length,
      openCount: openOrders.length,
      canceledCount: canceledOrders.length,
      salesTotal: paidOrders.reduce((sum, order) => sum + order.total, 0),
      openTotal: openOrders.reduce((sum, order) => sum + order.total, 0),
      byType
    };
  }

  function dailySummary(now = new Date()) {
    const overview = businessOverview(now);
    const report = dailyReport(overview.date);
    return {
      ...overview,
      paidTotal: report.salesTotal,
      unpaidTotal: report.openTotal,
      topItems: report.topItems
    };
  }

  function dailyReport(now = new Date()) {
    const targetDate = typeof now === 'string' ? now : dateKey(now);
    const overview = businessOverview(new Date(`${targetDate}T12:00:00`));
    overview.date = targetDate;
    const paidOrders = loadStore().orders.filter((order) => {
      return order.paymentStatus === 'paid' && dateKey(order.paidAt || order.createdAt) === targetDate;
    });
    const paymentMethods = {};
    const itemMap = new Map();
    paidOrders.forEach((order) => {
      const method = order.paymentMethod || 'cash';
      paymentMethods[method] = (paymentMethods[method] || 0) + order.total;
      order.lines.forEach((line) => {
        const current = itemMap.get(line.menuItemId) || { menuItemId: line.menuItemId, nameJa: line.nameJa, quantity: 0, total: 0 };
        current.quantity += line.quantity;
        current.total += line.price * line.quantity;
        itemMap.set(line.menuItemId, current);
      });
    });
    const cashExpected = paidOrders
      .filter((order) => (order.paymentMethod || 'cash') === 'cash')
      .reduce((sum, order) => sum + order.total, 0);
    const openOrders = loadStore().orders.filter((order) => {
      return order.paymentStatus !== 'paid' && order.paymentStatus !== 'canceled' && dateKey(order.createdAt) === targetDate;
    });
    return {
      ...overview,
      salesTotal: paidOrders.reduce((sum, order) => sum + order.total, 0),
      cashExpected,
      openTotal: openOrders.reduce((sum, order) => sum + order.total, 0),
      openOrderCount: openOrders.length,
      readyToClose: openOrders.length === 0,
      paymentMethods,
      topItems: Array.from(itemMap.values()).sort((a, b) => b.quantity - a.quantity || b.total - a.total)
    };
  }

  function closeBusinessDay({ date, cashActual, note = '' }) {
    const store = loadStore();
    const report = dailyReport(date);
    const normalized = normalizeDailyClose({
      id: 'CLOSE-' + date + '-' + randomToken().slice(0, 4),
      date,
      cashExpected: report.cashExpected,
      cashActual: Number(cashActual || 0),
      cashDifference: Number(cashActual || 0) - report.cashExpected,
      salesTotal: report.salesTotal,
      openTotal: report.openTotal,
      paymentMethods: report.paymentMethods,
      note,
      closedAt: new Date().toISOString()
    });
    const index = store.dailyCloses.findIndex((entry) => entry.date === date);
    if (index >= 0) store.dailyCloses[index] = normalized;
    else store.dailyCloses.unshift(normalized);
    addAuditEvent(store, {
      module: 'checkout',
      action: 'close_business_day',
      actor: '店长',
      target: date,
      summary: `Daily close ${date}`,
      amount: normalized.salesTotal,
      meta: { cashActual: normalized.cashActual, cashDifference: normalized.cashDifference }
    });
    saveStore(store);
    return normalized;
  }

  function dailyCloseHistory() {
    return loadStore().dailyCloses
      .slice()
      .sort((a, b) => String(b.closedAt).localeCompare(String(a.closedAt)));
  }

  function managerAlerts(now = new Date()) {
    const store = loadStore();
    const report = dailyReport(now);
    const inventory = inventoryStatus();
    const labor = laborSummary(now);
    const latestClose = dailyCloseHistory()[0];
    const unpaidOrders = store.orders.filter((order) => order.paymentStatus !== 'paid');
    const unpaidTotal = unpaidOrders.reduce((sum, order) => sum + order.total, 0);
    const alerts = [];
    if (unpaidOrders.length > 0) alerts.push({
      type: 'unpaid_orders',
      severity: 'danger',
      module: 'checkout',
      summary: `${unpaidOrders.length} unpaid orders`,
      amount: unpaidTotal,
      quantity: unpaidOrders.length
    });
    if (inventory.lowStock.length > 0) alerts.push({
      type: 'low_stock',
      severity: 'warning',
      module: 'inventory',
      summary: `${inventory.lowStock.length} low stock items`,
      quantity: inventory.lowStock.length
    });
    if (latestClose && latestClose.cashDifference !== 0) alerts.push({
      type: 'cash_difference',
      severity: latestClose.cashDifference < 0 ? 'danger' : 'warning',
      module: 'checkout',
      summary: `Cash difference ${latestClose.date}`,
      amount: Math.abs(latestClose.cashDifference),
      quantity: 1
    });
    if (labor.onDuty.length > 0) alerts.push({
      type: 'staff_on_duty',
      severity: 'info',
      module: 'staff',
      summary: `${labor.onDuty.length} staff on duty`,
      quantity: labor.onDuty.length
    });
    const checkoutRequests = store.tables.filter((table) => table.checkoutRequestedAt);
    if (checkoutRequests.length > 0) alerts.push({
      type: 'checkout_requested',
      severity: 'info',
      module: 'checkout',
      summary: `${checkoutRequests.length} checkout requests`,
      quantity: checkoutRequests.length
    });
    const staffCalls = activeStaffCalls();
    if (staffCalls.length > 0) alerts.push({
      type: 'staff_call',
      severity: 'warning',
      module: 'table',
      summary: staffCalls.map((call) => `Table ${call.tableId}: ${call.note || call.reason}`).join(' / '),
      quantity: staffCalls.length,
      calls: staffCalls
    });
    return alerts;
  }

  function upsertMenuItem(item) {
    const store = loadStore();
    const normalized = { ...item, price: Number(item.price), soldOut: Boolean(item.soldOut), recommended: Boolean(item.recommended) };
    const index = store.menu.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.menu[index] = normalized;
    else store.menu.push(normalized);
    addAuditEvent(store, {
      module: 'admin',
      action: 'save_menu_item',
      actor: '店长',
      target: normalized.id,
      summary: `${normalized.nameJa} / ${normalized.nameZh}`,
      amount: normalized.price,
      meta: { soldOut: normalized.soldOut }
    });
    saveStore(store);
    return normalized;
  }

  function toggleSoldOut(menuItemId) {
    const store = loadStore();
    let updated = null;
    store.menu = store.menu.map((item) => {
      if (item.id !== menuItemId) return item;
      updated = { ...item, soldOut: !item.soldOut };
      return updated;
    });
    if (updated) addAuditEvent(store, {
      module: 'admin',
      action: 'toggle_soldout',
      actor: '店长',
      target: menuItemId,
      summary: `${updated.nameJa} ${updated.soldOut ? 'sold out' : 'selling'}`,
      meta: { soldOut: updated.soldOut }
    });
    saveStore(store);
  }

  function adjustInventory(menuItemId, changes) {
    const store = loadStore();
    const item = store.menu.find((entry) => entry.id === menuItemId);
    if (!item) throw new Error('Menu item not found');
    const existing = store.inventory.find((entry) => entry.menuItemId === menuItemId);
    const normalized = {
      menuItemId,
      stock: Number(changes.stock ?? existing?.stock ?? 0),
      safetyStock: Number(changes.safetyStock ?? existing?.safetyStock ?? 0)
    };
    if (existing) Object.assign(existing, normalized);
    else store.inventory.push(normalized);
    setMenuSoldOutByStock(store, menuItemId, normalized.stock);
    addAuditEvent(store, {
      module: 'inventory',
      action: 'adjust_inventory',
      actor: '店长',
      target: menuItemId,
      summary: `Stock ${menuItemId}: ${normalized.stock}`,
      quantity: normalized.stock,
      meta: { safetyStock: normalized.safetyStock }
    });
    saveStore(store);
    return normalized;
  }

  function recordInventoryMovement(menuItemId, movement) {
    const store = loadStore();
    const entry = addInventoryMovement(store, menuItemId, movement);
    addAuditEvent(store, {
      module: 'inventory',
      action: 'inventory_movement',
      actor: '店长',
      target: menuItemId,
      summary: `${entry.type} ${menuItemId}`,
      quantity: Math.abs(entry.quantity),
      meta: { type: entry.type, stockAfter: entry.stockAfter, note: entry.note }
    });
    saveStore(store);
    return entry;
  }

  function inventoryMovements(menuItemId) {
    return loadStore().inventoryMovements
      .filter((entry) => !menuItemId || entry.menuItemId === menuItemId)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  }

  function inventoryStatus() {
    const store = loadStore();
    const items = store.inventory.map((entry) => {
      const item = store.menu.find((menuItem) => menuItem.id === entry.menuItemId);
      return {
        ...entry,
        nameJa: item?.nameJa || entry.menuItemId,
        nameZh: item?.nameZh || entry.menuItemId,
        soldOut: item?.soldOut === true,
        lowStock: entry.stock <= entry.safetyStock
      };
    });
    return {
      items,
      lowStock: items.filter((entry) => entry.lowStock)
    };
  }

  function upsertStaff(staff) {
    const store = loadStore();
    const normalized = normalizeStaff([staff])[0];
    if (!normalized) throw new Error('Staff name is required');
    const index = store.staff.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.staff[index] = normalized;
    else store.staff.push(normalized);
    addAuditEvent(store, {
      module: 'staff',
      action: 'save_staff',
      actor: '店长',
      target: normalized.id,
      summary: `${normalized.name} / ${normalized.role}`,
      amount: normalized.hourlyWage,
      meta: { active: normalized.active }
    });
    saveStore(store);
    return normalized;
  }

  function upsertStaffSchedule(schedule) {
    const store = loadStore();
    if (!store.staff.some((entry) => entry.id === schedule.staffId)) throw new Error('Staff not found');
    const normalized = normalizeStaffSchedule({
      ...schedule,
      id: schedule.id || `${schedule.staffId}-${schedule.date}`
    });
    const index = store.staffSchedules.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.staffSchedules[index] = normalized;
    else store.staffSchedules.push(normalized);
    addAuditEvent(store, {
      module: 'staff',
      action: 'save_schedule',
      actor: '店长',
      target: normalized.staffId,
      summary: `${normalized.date} ${normalized.startTime}-${normalized.endTime}`,
      quantity: scheduleMinutes(normalized),
      meta: { date: normalized.date }
    });
    saveStore(store);
    return normalized;
  }

  function dateKey(value) {
    const date = new Date(value);
    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');
  }

  function minutesOfDay(isoTime) {
    const date = new Date(isoTime);
    return date.getHours() * 60 + date.getMinutes();
  }

  function scheduleMinutes(schedule) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;
    return Math.max(0, end - start - schedule.breakMinutes);
  }

  function scheduleBounds(schedule) {
    const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
    const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
    return {
      start: startHour * 60 + startMinute,
      end: endHour * 60 + endMinute
    };
  }

  function openTimeEntry(store, staffId) {
    return store.timeEntries.find((entry) => entry.staffId === staffId && !entry.clockOut);
  }

  function clockIn(staffId, now = new Date()) {
    const store = loadStore();
    if (!store.staff.some((entry) => entry.id === staffId && entry.active)) throw new Error('Staff not active');
    if (openTimeEntry(store, staffId)) throw new Error('Staff already clocked in');
    const entry = normalizeTimeEntry({
      id: 'TIME-' + Date.now() + '-' + randomToken().slice(0, 4),
      staffId,
      clockIn: new Date(now).toISOString(),
      status: 'working'
    });
    store.timeEntries.unshift(entry);
    addAuditEvent(store, {
      module: 'staff',
      action: 'clock_in',
      actor: '店长',
      target: staffId,
      summary: `${staffId} clock in`,
      meta: { clockIn: entry.clockIn }
    });
    saveStore(store);
    return entry;
  }

  function startBreak(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry || entry.status !== 'working') throw new Error('Staff is not working');
    entry.breakStartedAt = new Date(now).toISOString();
    entry.status = 'break';
    addAuditEvent(store, {
      module: 'staff',
      action: 'start_break',
      actor: '店长',
      target: staffId,
      summary: `${staffId} start break`,
      meta: { breakStartedAt: entry.breakStartedAt }
    });
    saveStore(store);
    return entry;
  }

  function endBreak(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry || entry.status !== 'break') throw new Error('Staff is not on break');
    const started = new Date(entry.breakStartedAt).getTime();
    entry.breakMinutes += Math.max(0, Math.round((new Date(now).getTime() - started) / 60000));
    entry.breakStartedAt = '';
    entry.status = 'working';
    addAuditEvent(store, {
      module: 'staff',
      action: 'end_break',
      actor: '店长',
      target: staffId,
      summary: `${staffId} end break`,
      quantity: entry.breakMinutes
    });
    saveStore(store);
    return entry;
  }

  function workedMinutes(entry, now = new Date()) {
    const end = entry.clockOut ? new Date(entry.clockOut).getTime() : new Date(now).getTime();
    const start = new Date(entry.clockIn).getTime();
    const activeBreak = entry.breakStartedAt ? Math.max(0, Math.round((new Date(now).getTime() - new Date(entry.breakStartedAt).getTime()) / 60000)) : 0;
    return Math.max(0, Math.round((end - start) / 60000) - entry.breakMinutes - activeBreak);
  }

  function clockOut(staffId, now = new Date()) {
    const store = loadStore();
    const entry = openTimeEntry(store, staffId);
    if (!entry) throw new Error('Staff is not clocked in');
    if (entry.status === 'break') {
      const started = new Date(entry.breakStartedAt).getTime();
      entry.breakMinutes += Math.max(0, Math.round((new Date(now).getTime() - started) / 60000));
      entry.breakStartedAt = '';
    }
    entry.clockOut = new Date(now).toISOString();
    entry.status = 'done';
    addAuditEvent(store, {
      module: 'staff',
      action: 'clock_out',
      actor: '店长',
      target: staffId,
      summary: `${staffId} clock out`,
      quantity: workedMinutes(entry, now),
      meta: { clockOut: entry.clockOut }
    });
    saveStore(store);
    return entry;
  }

  function laborSummary(now = new Date()) {
    const store = loadStore();
    const summaryDate = dateKey(now);
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const schedules = store.staffSchedules
      .filter((schedule) => schedule.date === summaryDate)
      .map((schedule) => ({
        ...schedule,
        staff: store.staff.find((staff) => staff.id === schedule.staffId),
        scheduledMinutes: scheduleMinutes(schedule)
      }));
    const entries = store.timeEntries.filter((entry) => {
      const clockInTime = new Date(entry.clockIn);
      return clockInTime >= start && clockInTime < end;
    }).map((entry) => ({
      ...entry,
      staff: store.staff.find((staff) => staff.id === entry.staffId),
      workedMinutes: workedMinutes(entry, now)
    })).map((entry) => {
      const schedule = schedules.find((candidate) => candidate.staffId === entry.staffId);
      const staff = entry.staff || {};
      const bounds = schedule ? scheduleBounds(schedule) : null;
      const clockInMinutes = minutesOfDay(entry.clockIn);
      const clockOutMinutes = entry.clockOut ? minutesOfDay(entry.clockOut) : null;
      const lateMinutes = bounds ? Math.max(0, clockInMinutes - bounds.start) : 0;
      const earlyLeaveMinutes = bounds && clockOutMinutes !== null ? Math.max(0, bounds.end - clockOutMinutes) : 0;
      return {
        ...entry,
        schedule,
        lateMinutes,
        earlyLeaveMinutes,
        estimatedWage: Math.round((entry.workedMinutes / 60) * Number(staff.hourlyWage || 0))
      };
    });
    const totals = entries.reduce((result, entry) => ({
      workedMinutes: result.workedMinutes + entry.workedMinutes,
      breakMinutes: result.breakMinutes + entry.breakMinutes,
      estimatedWages: result.estimatedWages + entry.estimatedWage
    }), { workedMinutes: 0, breakMinutes: 0, estimatedWages: 0 });
    const nowMinutes = minutesOfDay(now);
    const scheduledEntries = schedules.map((schedule) => {
      const dayEntry = entries.find((entry) => entry.staffId === schedule.staffId);
      const bounds = scheduleBounds(schedule);
      const staff = schedule.staff || {};
      return {
        ...schedule,
        entry: dayEntry || null,
        scheduledWage: Math.round((schedule.scheduledMinutes / 60) * Number(staff.hourlyWage || 0)),
        isStarted: bounds.start <= nowMinutes
      };
    });
    const missing = scheduledEntries.filter((schedule) => schedule.isStarted && !schedule.entry);
    const upcoming = scheduledEntries.filter((schedule) => !schedule.isStarted && !schedule.entry);
    const late = entries.filter((entry) => entry.schedule && entry.lateMinutes > 0);
    return {
      staff: store.staff,
      schedules,
      entries,
      onDuty: entries.filter((entry) => !entry.clockOut),
      totals,
      coverage: {
        scheduledCount: scheduledEntries.length,
        clockedInScheduledCount: scheduledEntries.filter((schedule) => schedule.entry).length,
        onDutyCount: entries.filter((entry) => !entry.clockOut).length,
        missingCount: missing.length,
        lateCount: late.length,
        upcomingCount: upcoming.length,
        scheduledWageEstimate: scheduledEntries.reduce((sum, schedule) => sum + schedule.scheduledWage, 0),
        missing,
        late,
        upcoming
      }
    };
  }

  function upsertTable(table) {
    const store = loadStore();
    const existing = store.tables.find((entry) => entry.id === String(table.id));
    const normalized = {
      id: String(table.id).trim(),
      area: String(table.area || 'A').trim(),
      seats: Number(table.seats || 2),
      status: existing?.status || table.status || 'available',
      enabled: table.enabled !== false,
      token: table.token || existing?.token || randomToken(),
      guestCount: Number(table.guestCount ?? existing?.guestCount ?? 0),
      openedAt: table.openedAt || existing?.openedAt || '',
      note: table.note ?? existing?.note ?? ''
    };
    if (!normalized.id) throw new Error('Table id is required');
    const index = store.tables.findIndex((entry) => entry.id === normalized.id);
    if (index >= 0) store.tables[index] = normalized;
    else store.tables.push(normalized);
    store.tables.sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
    addAuditEvent(store, {
      module: 'table',
      action: 'save_table',
      actor: '店长',
      target: normalized.id,
      summary: `${normalized.area}-${normalized.id}`,
      quantity: normalized.seats,
      meta: { enabled: normalized.enabled }
    });
    saveStore(store);
    return normalized;
  }

  function toggleTableEnabled(tableId) {
    const store = loadStore();
    let updated = null;
    store.tables = store.tables.map((table) => {
      if (table.id !== String(tableId)) return table;
      updated = { ...table, enabled: !table.enabled };
      return updated;
    });
    if (updated) addAuditEvent(store, {
      module: 'table',
      action: 'toggle_table',
      actor: '店长',
      target: tableId,
      summary: `${updated.area}-${updated.id} ${updated.enabled ? 'enabled' : 'disabled'}`,
      meta: { enabled: updated.enabled }
    });
    saveStore(store);
  }

  function regenerateTableToken(tableId) {
    const store = loadStore();
    store.tables = store.tables.map((table) => table.id === String(tableId) ? { ...table, token: randomToken() } : table);
    addAuditEvent(store, {
      module: 'table',
      action: 'regenerate_table_token',
      actor: '店长',
      target: tableId,
      summary: `Regenerate QR token for table ${tableId}`
    });
    saveStore(store);
  }

  function tableOrderUrl(input, tableId) {
    if (typeof input === 'string') {
      const normalized = String(input || '').replace(/\/+$/, '');
      return `${normalized}/order/?table=${encodeURIComponent(String(tableId))}`;
    }
    const { origin, basePath, table } = input || {};
    const cleanBase = ('/' + (basePath || '').replace(/^\/|\/$/g, '')).replace(/^\/$/, '');
    const url = new URL(`${cleanBase}/order/`, origin);
    url.searchParams.set('table', table.id);
    url.searchParams.set('token', table.token);
    return url.toString();
  }

  function validateTableAccess(tableId, token) {
    const table = loadStore().tables.find((entry) => entry.id === String(tableId));
    if (!table || table.enabled === false) return false;
    if (!token) return true;
    return table.token === token;
  }

  function requireTable(store, tableId) {
    const table = store.tables.find((entry) => entry.id === String(tableId));
    if (!table) throw new Error('Table not found');
    return table;
  }

  function openTable(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    const openedAt = new Date().toISOString();
    store.tables = store.tables.map((table) => table.id === String(tableId) ? {
      ...table,
      status: 'occupied',
      guestCount: Number(details.guestCount || table.guestCount || 0),
      openedAt: table.openedAt || openedAt,
      note: details.note ?? table.note ?? '',
      checkoutRequestedAt: '',
      checkoutNote: ''
    } : table);
    addTableEvent(store, { type: 'open', tableId, guestCount: Number(details.guestCount || 0), note: details.note || '', source: details.source || 'staff' });
    addAuditEvent(store, {
      module: 'table',
      action: 'open_table',
      actor: details.source === 'customer' ? '顾客' : '会计',
      target: tableId,
      summary: `Open table ${tableId}`,
      quantity: Number(details.guestCount || 0),
      meta: { note: details.note || '', source: details.source || 'staff' }
    });
    saveStore(store);
  }

  function startTableSession(tableId, details = {}) {
    const guestCount = Math.max(1, Number(details.guestCount || 1));
    openTable(tableId, {
      guestCount,
      note: details.note || '',
      source: details.source || 'customer'
    });
    return loadStore().tables.find((table) => table.id === String(tableId)) || null;
  }

  function requestCheckout(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    const requestedAt = new Date().toISOString();
    store.tables = store.tables.map((table) => table.id === String(tableId) ? {
      ...table,
      status: 'checkout-requested',
      checkoutRequestedAt: requestedAt,
      checkoutNote: details.note || ''
    } : table);
    addTableEvent(store, {
      type: 'checkout_request',
      tableId,
      note: details.note || '',
      source: details.source || 'customer'
    });
    addAuditEvent(store, {
      module: 'checkout',
      action: 'request_checkout',
      actor: details.source === 'customer' ? '顾客' : '会计',
      target: tableId,
      summary: `Checkout requested table ${tableId}`,
      meta: { note: details.note || '', source: details.source || 'customer' }
    });
    saveStore(store);
    return loadStore().tables.find((table) => table.id === String(tableId)) || null;
  }

  function activeStaffCalls() {
    return loadStore().tableEvents
      .filter((event) => event.type === 'staff_call' && !event.resolvedAt)
      .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  function requestStaffCall(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    const event = addTableEvent(store, {
      type: 'staff_call',
      tableId,
      reason: details.reason || 'other',
      note: details.note || '',
      source: details.source || 'customer'
    });
    addAuditEvent(store, {
      module: 'table',
      action: 'request_staff_call',
      actor: details.source === 'customer' ? '顾客' : '会计',
      target: tableId,
      summary: `Staff call table ${tableId}`,
      meta: { reason: event.reason, note: event.note, source: event.source }
    });
    saveStore(store);
    return event;
  }

  function resolveStaffCall(callId, details = {}) {
    const store = loadStore();
    let resolved = null;
    const resolvedAt = new Date().toISOString();
    store.tableEvents = store.tableEvents.map((event) => {
      if (event.id !== callId || event.type !== 'staff_call') return event;
      resolved = { ...event, resolvedAt, resolvedBy: details.source || 'staff' };
      return resolved;
    });
    if (!resolved) return null;
    addAuditEvent(store, {
      module: 'table',
      action: 'resolve_staff_call',
      actor: details.source === 'customer' ? '顾客' : '店员',
      target: resolved.tableId,
      summary: `Staff call resolved table ${resolved.tableId}`,
      meta: { callId, reason: resolved.reason }
    });
    saveStore(store);
    return resolved;
  }

  function resetTableState(table, note = '') {
    return { ...table, status: 'available', guestCount: 0, openedAt: '', note, checkoutRequestedAt: '', checkoutNote: '' };
  }

  function transferTable(fromTableId, toTableId, details = {}) {
    const store = loadStore();
    const from = requireTable(store, fromTableId);
    const to = requireTable(store, toTableId);
    store.orders = store.orders.map((order) => (
      order.tableId === String(fromTableId) && order.paymentStatus !== 'paid'
        ? { ...order, tableId: String(toTableId) }
        : order
    ));
    store.tables = store.tables.map((table) => {
      if (table.id === String(fromTableId)) return resetTableState(table);
      if (table.id === String(toTableId)) return {
        ...table,
        status: 'occupied',
        guestCount: to.guestCount || from.guestCount,
        openedAt: to.openedAt || from.openedAt || new Date().toISOString(),
        note: details.note || to.note || from.note || ''
      };
      return table;
    });
    addTableEvent(store, { type: 'transfer', fromTableId, toTableId, note: details.note || '' });
    addAuditEvent(store, {
      module: 'table',
      action: 'transfer_table',
      actor: '会计',
      target: `${fromTableId}->${toTableId}`,
      summary: `Transfer table ${fromTableId} to ${toTableId}`,
      meta: { fromTableId, toTableId, note: details.note || '' }
    });
    saveStore(store);
  }

  function mergeTables(fromTableId, toTableId, details = {}) {
    const store = loadStore();
    const from = requireTable(store, fromTableId);
    const to = requireTable(store, toTableId);
    store.orders = store.orders.map((order) => (
      order.tableId === String(fromTableId) && order.paymentStatus !== 'paid'
        ? { ...order, tableId: String(toTableId) }
        : order
    ));
    store.tables = store.tables.map((table) => {
      if (table.id === String(fromTableId)) return resetTableState(table);
      if (table.id === String(toTableId)) return {
        ...table,
        status: 'occupied',
        guestCount: Number(to.guestCount || 0) + Number(from.guestCount || 0),
        openedAt: to.openedAt || from.openedAt || new Date().toISOString(),
        note: details.note || to.note || from.note || ''
      };
      return table;
    });
    addTableEvent(store, { type: 'merge', fromTableId, toTableId, note: details.note || '' });
    addAuditEvent(store, {
      module: 'table',
      action: 'merge_table',
      actor: '会计',
      target: `${fromTableId}->${toTableId}`,
      summary: `Merge table ${fromTableId} into ${toTableId}`,
      meta: { fromTableId, toTableId, note: details.note || '' }
    });
    saveStore(store);
  }

  function clearTable(tableId, details = {}) {
    const store = loadStore();
    requireTable(store, tableId);
    store.tables = store.tables.map((table) => table.id === String(tableId) ? resetTableState(table, details.note || '') : table);
    addTableEvent(store, { type: 'clear', tableId, note: details.note || '' });
    addAuditEvent(store, {
      module: 'table',
      action: 'clear_table',
      actor: '会计',
      target: tableId,
      summary: `Clear table ${tableId}`,
      meta: { note: details.note || '' }
    });
    saveStore(store);
  }

  function customerProfiles() {
    const store = loadStore();
    const noteMap = new Map(store.customerNotes.map((entry) => [entry.phone, entry.note]));
    const profiles = new Map();
    store.orders
      .filter((order) => normalizePhone(order.customer?.phone))
      .forEach((order) => {
        const phone = normalizePhone(order.customer.phone);
        const current = profiles.get(phone) || {
          phone,
          name: '',
          note: noteMap.get(phone) || '',
          orderCount: 0,
          totalSpent: 0,
          lastOrderId: '',
          lastOrderedAt: '',
          orders: []
        };
        current.orderCount += 1;
        current.totalSpent += order.paymentStatus === 'paid' ? order.total : 0;
        current.orders.push(order);
        if (!current.lastOrderedAt || String(order.createdAt).localeCompare(current.lastOrderedAt) > 0) {
          current.lastOrderedAt = order.createdAt;
          current.lastOrderId = order.id;
          if (order.customer?.name) current.name = order.customer.name;
        } else if (!current.name && order.customer?.name) {
          current.name = order.customer.name;
        }
        profiles.set(phone, current);
      });
    return Array.from(profiles.values())
      .map((profile) => ({
        ...profile,
        orders: profile.orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      }))
      .sort((a, b) => String(b.lastOrderedAt).localeCompare(String(a.lastOrderedAt)));
  }

  function customerProfile(phone) {
    return customerProfiles().find((profile) => profile.phone === normalizePhone(phone)) || null;
  }

  function updateCustomerNote(phone, note) {
    const store = loadStore();
    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) throw new Error('Phone is required');
    const normalized = normalizeCustomerNote({ phone: normalizedPhone, note, updatedAt: new Date().toISOString() });
    const index = store.customerNotes.findIndex((entry) => entry.phone === normalizedPhone);
    if (index >= 0) store.customerNotes[index] = normalized;
    else store.customerNotes.push(normalized);
    addAuditEvent(store, {
      module: 'customer',
      action: 'update_customer_note',
      actor: '店长',
      target: normalizedPhone,
      summary: `Customer note ${normalizedPhone}`,
      meta: { note: normalized.note }
    });
    saveStore(store);
    return normalized;
  }

  function resetDemo() {
    const previous = loadStore();
    const next = clone(seed);
    next.auditEvents = previous.auditEvents || [];
    addAuditEvent(next, {
      module: 'system',
      action: 'reset_demo',
      actor: '店长',
      target: 'demo',
      summary: 'Reset demo data'
    });
    saveStore(next);
    const keys = storage().keys ? storage().keys() : Object.keys(storage());
    keys.forEach?.((key) => {
      if (key.startsWith(CART_PREFIX)) storage().removeItem(key);
    });
  }

  function auditEvents(limit = 100) {
    return loadStore().auditEvents
      .slice()
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, Number(limit || 100));
  }

  const api = {
    STORE_KEY,
    seed,
    loadStore,
    saveStore,
    loadCart,
    saveCart,
    clearCart,
    addToCart,
    updateCartLine,
    cartTotal,
    availablePaymentMethods,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    tableOpenSummary,
    tableOrderProgress,
    tableRecentCheckout,
    kitchenOrderGroups,
    kitchenUrgency,
    kitchenQueueItems,
    updateOrderLineStatus,
    checkoutTable,
    checkoutOrder,
    paymentHistory,
    businessOverview,
    dailySummary,
    dailyReport,
    closeBusinessDay,
    dailyCloseHistory,
    managerAlerts,
    upsertMenuItem,
    toggleSoldOut,
    adjustInventory,
    recordInventoryMovement,
    inventoryMovements,
    inventoryStatus,
    upsertTable,
    toggleTableEnabled,
    regenerateTableToken,
    tableOrderUrl,
    validateTableAccess,
    startTableSession,
    requestCheckout,
    activeStaffCalls,
    requestStaffCall,
    resolveStaffCall,
    openTable,
    transferTable,
    mergeTables,
    clearTable,
    customerProfiles,
    customerProfile,
    updateCustomerNote,
    upsertStaff,
    upsertStaffSchedule,
    clockIn,
    startBreak,
    endBreak,
    clockOut,
    laborSummary,
    auditEvents,
    resetDemo
  };

  root.IzakayaCore = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
