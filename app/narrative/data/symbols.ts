import manifestData from "../assets/manifestData";

type SymbolCategory = "identity" | "daily" | "ritual";

type SymbolDef = {
  category: SymbolCategory;
  name: string;
  englishName: string;
  narrativeFunction: string;
  chapters: string[];
  keywords: string[];
  description: string;
};

const defs: Record<string, SymbolDef> = {
  A1: {
    category: "identity",
    name: "羽冠 / 头饰",
    englishName: "Feather Crown",
    narrativeFunction: "身份被看见",
    chapters: ["chapter-02", "chapter-07"],
    keywords: ["身份", "头饰", "族群", "仪式"],
    description: "头饰不是单纯装饰，而是身体进入族群秩序时最先被看见的标记。",
  },
  A2: {
    category: "identity",
    name: "侧面头饰轮廓",
    englishName: "Profile Headdress",
    narrativeFunction: "身份轮廓",
    chapters: [],
    keywords: ["轮廓", "侧面"],
    description: "侧面线条强调头饰与身体线条共同构成的可见秩序。",
  },
  A3: {
    category: "identity",
    name: "圆耳环",
    englishName: "Round Earrings",
    narrativeFunction: "身份被看见",
    chapters: ["chapter-02", "chapter-07"],
    keywords: ["耳饰", "圆形", "身体"],
    description: "耳饰让面部成为被注视与识别的文化界面。",
  },
  A4: {
    category: "identity",
    name: "衣边垂饰",
    englishName: "Garment Edge",
    narrativeFunction: "边饰与流动",
    chapters: ["chapter-02", "chapter-06"],
    keywords: ["衣边", "垂饰", "织纹"],
    description: "衣边与垂饰在行走与礼仪动作中形成动态的身份表达。",
  },
  A5: {
    category: "identity",
    name: "项圈",
    englishName: "Collar Ornament",
    narrativeFunction: "颈部秩序",
    chapters: ["chapter-02"],
    keywords: ["项圈", "颈部", "礼仪"],
    description: "项圈在身体中心线上建立仪式性的视觉焦点。",
  },
  A6: {
    category: "identity",
    name: "弯腰带",
    englishName: "Curved Sash",
    narrativeFunction: "身体曲线",
    chapters: ["chapter-02", "chapter-04"],
    keywords: ["腰带", "曲线", "束缚与解放"],
    description: "腰带曲线既是实用系束，也是身体装饰的节奏线。",
  },
  A7: {
    category: "identity",
    name: "腰饰",
    englishName: "Waist Ornament",
    narrativeFunction: "重心与装饰",
    chapters: ["chapter-06"],
    keywords: ["腰饰", "重心"],
    description: "腰饰提示身体重心与劳作姿态中的审美。",
  },
  A8: {
    category: "identity",
    name: "冠饰",
    englishName: "Crown Ornament",
    narrativeFunction: "顶点象征",
    chapters: ["chapter-02", "chapter-07"],
    keywords: ["冠饰", "顶点", "礼仪"],
    description: "冠饰在身体最高点标记仪式与节庆中的身份升级。",
  },
  B1: {
    category: "daily",
    name: "研臼",
    englishName: "Mortar",
    narrativeFunction: "劳作与饮食",
    chapters: [],
    keywords: ["研磨", "厨房", "日常"],
    description: "研臼象征饮食制备中最朴素的手作与共同体生活。",
  },
  B2: {
    category: "daily",
    name: "伞",
    englishName: "Umbrella",
    narrativeFunction: "遮蔽与出行",
    chapters: ["chapter-05"],
    keywords: ["伞", "出行", "庇护"],
    description: "伞在日常与节庆出行中连接身体与气候、公共空间。",
  },
  B3: {
    category: "daily",
    name: "长笛",
    englishName: "Long Flute",
    narrativeFunction: "声音与社交",
    chapters: ["chapter-04"],
    keywords: ["笛", "乐声", "聚会"],
    description: "笛声在待客与村寨公共生活中编织听觉记忆。",
  },
  B4: {
    category: "daily",
    name: "花藤",
    englishName: "Flower Vine",
    narrativeFunction: "自然入屋",
    chapters: ["chapter-04", "chapter-05", "chapter-07"],
    keywords: ["花", "藤", "庭院"],
    description: "花藤把自然引入居住空间，是日常审美与季节感的载体。",
  },
  B5: {
    category: "daily",
    name: "猫",
    englishName: "Cat",
    narrativeFunction: "庭院伴侣",
    chapters: ["chapter-05"],
    keywords: ["猫", "庭院", "陪伴"],
    description: "猫作为庭院生灵，标记家的温度与日常节奏。",
  },
  B6: {
    category: "daily",
    name: "鸟",
    englishName: "Bird",
    narrativeFunction: "流动与迁徙",
    chapters: ["chapter-01", "chapter-05"],
    keywords: ["鸟", "迁徙", "天空"],
    description: "鸟象征古道上的信使与开放的天空。",
  },
  B7: {
    category: "daily",
    name: "陶罐",
    englishName: "Clay Pot",
    narrativeFunction: "器物与生活",
    chapters: ["chapter-01", "chapter-04", "chapter-05", "chapter-06", "chapter-07"],
    keywords: ["陶", "茶", "火"],
    description: "陶罐连接火、茶与待客，是生活技术的物质记忆。",
  },
  B8: {
    category: "daily",
    name: "家畜（坐）",
    englishName: "Seated Animal",
    narrativeFunction: "农牧日常",
    chapters: [],
    keywords: ["家畜", "劳作"],
    description: "家畜形象提示农牧交错中的生计与伦理。",
  },
  B9: {
    category: "daily",
    name: "犬",
    englishName: "Dog",
    narrativeFunction: "守望",
    chapters: ["chapter-05", "chapter-07"],
    keywords: ["犬", "门庭", "守望"],
    description: "犬在门庭与巷道之间标记家的边界与欢迎。",
  },
  C1: {
    category: "ritual",
    name: "掌心",
    englishName: "Open Palm",
    narrativeFunction: "献与受",
    chapters: ["chapter-03", "chapter-07"],
    keywords: ["掌心", "献茶", "礼"],
    description: "掌心是仪式中最直接的接触界面，表达献与受的伦理。",
  },
  C2: {
    category: "ritual",
    name: "牛角 / 骨器",
    englishName: "Ox Horn",
    narrativeFunction: "牺牲与力量",
    chapters: ["chapter-03"],
    keywords: ["牛", "牺牲", "力量"],
    description: "角与骨器在祭祀语境中连接动物性与神圣叙事。",
  },
  C3: {
    category: "ritual",
    name: "日纹螺旋",
    englishName: "Sun Spiral",
    narrativeFunction: "时间与循环",
    chapters: ["chapter-01", "chapter-03", "chapter-04", "chapter-06", "chapter-07"],
    keywords: ["太阳", "螺旋", "时间"],
    description: "螺旋日纹把自然周期转译为可凝视的仪式图形。",
  },
  C4: {
    category: "ritual",
    name: "象首图腾",
    englishName: "Elephant Totem",
    narrativeFunction: "庇护象征",
    chapters: ["chapter-03"],
    keywords: ["象", "图腾", "庇护"],
    description: "象首在南诏大理传统中常承载力量与吉祥的复合象征。",
  },
  C5: {
    category: "ritual",
    name: "花祭饰",
    englishName: "Flower Ritual Ornament",
    narrativeFunction: "花与仪式",
    chapters: ["chapter-05"],
    keywords: ["花", "祭祀", "装饰"],
    description: "花祭饰把自然之美纳入仪式化的身体与空间装饰。",
  },
  C6: {
    category: "ritual",
    name: "双人舞",
    englishName: "Double Dance",
    narrativeFunction: "共同体节律",
    chapters: ["chapter-03"],
    keywords: ["舞", "节律", "社群"],
    description: "双人舞体现仪式中身体与身体之间的同步与共鸣。",
  },
  C7: {
    category: "ritual",
    name: "角颅",
    englishName: "Horned Skull",
    narrativeFunction: "生与死的记忆",
    chapters: ["chapter-06"],
    keywords: ["角", "记忆", "张力"],
    description: "角颅意象提示传统与现代挤压下关于生与死的隐喻张力。",
  },
  C8: {
    category: "ritual",
    name: "孔雀 / 神鸟",
    englishName: "Peacock",
    narrativeFunction: "神圣羽衣",
    chapters: ["chapter-07"],
    keywords: ["孔雀", "神鸟", "羽衣"],
    description: "神鸟连接羽饰传统与当代品牌视觉中的「可见的神圣」。",
  },
};

function assetPathFor(id: string) {
  const files = manifestData.symbolFiles as Record<string, string>;
  return files[id] ?? "";
}

export type SymbolRecord = SymbolDef & { id: string; assetPath: string };

export const SYMBOL_BY_ID: Record<string, SymbolRecord> = Object.fromEntries(
  Object.keys(defs).map((id) => {
    const d = defs[id];
    return [
      id,
      {
        id,
        ...d,
        assetPath: assetPathFor(id),
      },
    ];
  }),
);

export const SYMBOL_LIST: SymbolRecord[] = Object.values(SYMBOL_BY_ID);
