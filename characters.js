/* =========================================================
   YAMA TYPE — 16タイプのキャラクター（山の生き物）
   生き物 : 生息域で目的軸（高山 P / 森 E）、社会性で仲間軸（単独 S / 群れ G）
   アイテム: 計画軸（道具・情報 L / 嗜好品・身につけるもの F）とリスク軸を表す
   ========================================================= */

const CHARACTERS = {

/* ---------- P・S 高山×単独 ---------- */
PSLC: { animal: "カモシカ", item: "折りたたんだ地形図", svg: `
  <rect x="59" y="126" width="12" height="24" rx="5" fill="#5C6C64"/>
  <rect x="89" y="126" width="12" height="24" rx="5" fill="#5C6C64"/>
  <rect x="58" y="144" width="14" height="8" rx="3" fill="#2C3A34"/>
  <rect x="88" y="144" width="14" height="8" rx="3" fill="#2C3A34"/>
  <ellipse cx="80" cy="117" rx="35" ry="27" fill="#6E7F76"/>
  <ellipse cx="80" cy="126" rx="20" ry="17" fill="#E9E4D8"/>
  <rect x="68" y="84" width="24" height="26" rx="6" fill="#6E7F76"/>
  <path d="M70 62 Q61 40 69 21" stroke="#2C3A34" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M90 62 Q99 40 91 21" stroke="#2C3A34" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="58" cy="67" rx="9.5" ry="13" fill="#5C6C64" transform="rotate(-28 58 67)"/>
  <ellipse cx="102" cy="67" rx="9.5" ry="13" fill="#5C6C64" transform="rotate(28 102 67)"/>
  <ellipse cx="80" cy="72" rx="24" ry="27" fill="#7B8C82"/>
  <ellipse cx="80" cy="88" rx="14" ry="12" fill="#E9E4D8"/>
  <ellipse cx="80" cy="84" rx="4.5" ry="3.4" fill="#2C3A34"/>
  <circle cx="69" cy="69" r="3.8" fill="#23302A"/>
  <circle cx="91" cy="69" r="3.8" fill="#23302A"/>
  <circle cx="70.3" cy="67.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.3" cy="67.7" r="1.3" fill="#FFFFFF"/>
  <g transform="rotate(-6 80 114)">
    <rect x="62" y="102" width="36" height="25" rx="2.5" fill="#F7F3E8" stroke="#A8A08A" stroke-width="1.6"/>
    <path d="M74 102 L74 127 M86 102 L86 127" stroke="#DCD3BC" stroke-width="1.3"/>
    <path d="M65 121 Q71 113 77 116 Q84 120 90 112" stroke="#8FA898" stroke-width="1.6" fill="none"/>
    <text x="80" y="112" text-anchor="middle" font-family="Outfit, sans-serif"
          font-size="10" font-weight="700" fill="#4E6B7A">MAP</text>
  </g>
  <ellipse cx="60" cy="116" rx="8.5" ry="9.5" fill="#5C6C64"/>
  <ellipse cx="100" cy="116" rx="8.5" ry="9.5" fill="#5C6C64"/>` },

PSLA: { animal: "イヌワシ", item: "ピッケル", svg: `
  <!-- 左翼（外へ大きく広げる） -->
  <path d="M62 92 Q40 88 22 98 Q6 108 2 124 Q14 117 28 116 Q20 125 18 138
           Q36 132 50 120 Q58 108 62 98 Z" fill="#4A3A2B"/>
  <path d="M58 104 Q42 108 30 116" stroke="#3A2C20" stroke-width="2.4" fill="none"/>
  <path d="M56 112 Q44 120 36 130" stroke="#3A2C20" stroke-width="2.2" fill="none"/>
  <!-- 尾羽 -->
  <path d="M66 124 L94 124 Q98 142 90 154 L70 154 Q62 142 66 124 Z" fill="#3D2F23"/>
  <path d="M74 128 L74 152 M86 128 L86 152" stroke="#4A3A2B" stroke-width="2"/>
  <!-- 足 -->
  <rect x="68" y="146" width="10" height="12" rx="4" fill="#D8A63E"/>
  <rect x="82" y="146" width="10" height="12" rx="4" fill="#D8A63E"/>
  <!-- ピッケル（体の前、右翼の内側） -->
  <g transform="rotate(9 112 96)">
    <rect x="109" y="48" width="6.5" height="90" rx="3" fill="#6B6B66"/>
    <rect x="109" y="48" width="3" height="90" fill="#8A8A84"/>
    <path d="M92 52 Q104 42 116 46 L116 54 Q106 50 96 58 Z" fill="#9EA4A8"/>
    <path d="M116 46 L132 54 L116 56 Z" fill="#B4BABE"/>
    <rect x="106" y="130" width="12" height="10" rx="2" fill="#3A3A36"/>
  </g>
  <!-- 胴 -->
  <ellipse cx="80" cy="104" rx="33" ry="32" fill="#6B5340"/>
  <path d="M80 78 Q64 92 66 112 Q80 106 94 112 Q96 92 80 78 Z" fill="#8A6D4E"/>
  <!-- 右翼（内側へ巻き込んでピッケルを抱える） -->
  <path d="M98 88 Q124 92 134 108 Q140 122 130 134 Q126 120 114 114
           Q120 126 112 134 Q100 122 96 104 Z" fill="#5A462F"/>
  <path d="M104 98 Q118 104 126 116" stroke="#4A3A2B" stroke-width="2.4" fill="none"/>
  <!-- 頭 -->
  <circle cx="80" cy="60" r="26" fill="#A98352"/>
  <path d="M54 58 Q80 30 106 58 Q80 46 54 58 Z" fill="#CDA667"/>
  <path d="M73 66 L87 66 Q86 80 80 85 Q75 80 73 66 Z" fill="#E0A33B"/>
  <path d="M77 80 Q80 88 83 80 Z" fill="#8A6A2B"/>
  <circle cx="68" cy="58" r="4" fill="#221A12"/>
  <circle cx="92" cy="58" r="4" fill="#221A12"/>
  <circle cx="69.4" cy="56.6" r="1.3" fill="#FFFFFF"/>
  <circle cx="93.4" cy="56.6" r="1.3" fill="#FFFFFF"/>
  <path d="M60 49 L75 54" stroke="#5A452C" stroke-width="4" stroke-linecap="round"/>
  <path d="M100 49 L85 54" stroke="#5A452C" stroke-width="4" stroke-linecap="round"/>` },

PSFC: { animal: "オコジョ", item: "使い込んだ水筒", svg: `
  <path d="M96 124 Q124 126 132 120" stroke="#F2EFE8" stroke-width="15" fill="none" stroke-linecap="round"/>
  <circle cx="134" cy="119" r="7.5" fill="#2E2620"/>
  <rect x="62" y="130" width="10" height="18" rx="5" fill="#E4DFD4"/>
  <rect x="88" y="130" width="10" height="18" rx="5" fill="#E4DFD4"/>
  <ellipse cx="78" cy="112" rx="30" ry="28" fill="#F2EFE8"/>
  <ellipse cx="78" cy="120" rx="19" ry="18" fill="#FBFAF6"/>
  <circle cx="60" cy="52" r="9" fill="#E4DFD4"/>
  <circle cx="98" cy="52" r="9" fill="#E4DFD4"/>
  <circle cx="60" cy="52" r="5" fill="#E8C9C2"/>
  <circle cx="98" cy="52" r="5" fill="#E8C9C2"/>
  <circle cx="79" cy="66" r="25" fill="#F7F5EF"/>
  <ellipse cx="79" cy="78" rx="11" ry="8.5" fill="#FBFAF6"/>
  <ellipse cx="79" cy="74" rx="3.8" ry="2.9" fill="#3A2E28"/>
  <circle cx="68" cy="63" r="3.8" fill="#2A221C"/>
  <circle cx="90" cy="63" r="3.8" fill="#2A221C"/>
  <circle cx="69.3" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="91.3" cy="61.7" r="1.3" fill="#FFFFFF"/>
  <!-- 水筒（左に光、右に影で立体感） -->
  <rect x="66" y="99" width="26" height="36" rx="7" fill="#3E5A68"/>
  <rect x="66" y="99" width="16" height="36" rx="7" fill="#5C8196"/>
  <rect x="70" y="102" width="5" height="30" rx="2.5" fill="#7CA3B8"/>
  <ellipse cx="79" cy="99" rx="13" ry="4" fill="#2F4A57"/>
  <rect x="72" y="89" width="14" height="11" rx="3" fill="#B8B2A6"/>
  <ellipse cx="79" cy="89" rx="7" ry="2.6" fill="#D2CEC4"/>
  <rect x="66" y="113" width="26" height="7" fill="#E9E4D8"/>
  <rect x="66" y="113" width="16" height="7" fill="#F4F1E9"/>
  <ellipse cx="61" cy="116" rx="8" ry="9" fill="#E4DFD4"/>
  <ellipse cx="97" cy="116" rx="8" ry="9" fill="#E4DFD4"/>` },

PSFA: { animal: "ツキノワグマ", item: "頭に巻いたバンダナ", svg: `
  <rect x="56" y="126" width="22" height="26" rx="10" fill="#2B2420"/>
  <rect x="82" y="126" width="22" height="26" rx="10" fill="#2B2420"/>
  <ellipse cx="67" cy="147" rx="9" ry="5" fill="#5C4E44"/>
  <ellipse cx="93" cy="147" rx="9" ry="5" fill="#5C4E44"/>
  <ellipse cx="80" cy="112" rx="40" ry="35" fill="#39302A"/>
  <path d="M80 88 L96 122 L80 132 L64 122 Z" fill="#E8E2D4"/>
  <ellipse cx="44" cy="112" rx="12" ry="17" fill="#2B2420" transform="rotate(-14 44 112)"/>
  <ellipse cx="116" cy="112" rx="12" ry="17" fill="#2B2420" transform="rotate(14 116 112)"/>
  <circle cx="52" cy="52" r="14" fill="#2B2420"/>
  <circle cx="108" cy="52" r="14" fill="#2B2420"/>
  <circle cx="52" cy="52" r="7" fill="#5C4E44"/>
  <circle cx="108" cy="52" r="7" fill="#5C4E44"/>
  <circle cx="80" cy="66" r="30" fill="#453A33"/>
  <ellipse cx="80" cy="80" rx="15" ry="12" fill="#C4B49E"/>
  <ellipse cx="80" cy="75" rx="5" ry="3.8" fill="#1E1815"/>
  <path d="M74 86 Q80 90 86 86" stroke="#8A7A66" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="68" cy="62" r="4.2" fill="#16110E"/>
  <circle cx="92" cy="62" r="4.2" fill="#16110E"/>
  <circle cx="69.4" cy="60.6" r="1.4" fill="#FFFFFF"/>
  <circle cx="93.4" cy="60.6" r="1.4" fill="#FFFFFF"/>
  <path d="M50 48 Q80 30 110 48 L108 57 Q80 40 52 57 Z" fill="#C2452C"/>
  <path d="M108 51 L124 60 L113 62 Z" fill="#A83A24"/>` },

/* ---------- P・G 高山×群れ ---------- */
PGLC: { animal: "ライチョウ", item: "首から下げたホイッスル", svg: `
  <ellipse cx="106" cy="112" rx="23" ry="11" fill="#7A6A52" transform="rotate(18 106 112)"/>
  <!-- 胴（夏毛：褐色の地に黒の斑） -->
  <ellipse cx="78" cy="102" rx="39" ry="35" fill="#A8905F"/>
  <path d="M44 118 Q78 108 114 118 Q110 132 78 137 Q46 132 44 118 Z" fill="#F2EEE3"/>
  <g fill="#6B563A" opacity=".85">
    <ellipse cx="66" cy="84" rx="7" ry="3.6" transform="rotate(-14 66 84)"/>
    <ellipse cx="90" cy="84" rx="7" ry="3.6" transform="rotate(14 90 84)"/>
    <ellipse cx="78" cy="94" rx="7" ry="3.6"/>
    <ellipse cx="58" cy="98" rx="6.4" ry="3.4" transform="rotate(-8 58 98)"/>
    <ellipse cx="98" cy="98" rx="6.4" ry="3.4" transform="rotate(8 98 98)"/>
  </g>
  <ellipse cx="50" cy="104" rx="14" ry="24" fill="#8E7847" transform="rotate(-6 50 104)"/>
  <rect x="66" y="132" width="9" height="15" rx="4" fill="#E0DACB"/>
  <rect x="85" y="132" width="9" height="15" rx="4" fill="#E0DACB"/>
  <!-- 頭 -->
  <circle cx="79" cy="60" r="25" fill="#B49A66"/>
  <path d="M57 54 Q79 36 101 54 Q79 44 57 54 Z" fill="#6B563A"/>
  <!-- 目の上の赤い肉冠 -->
  <path d="M62 50 Q68 44 75 49 Q68 48 62 50 Z" fill="#C2452C"/>
  <path d="M83 49 Q90 44 96 50 Q90 48 83 49 Z" fill="#C2452C"/>
  <path d="M73 67 L86 67 L79 77 Z" fill="#3E3A32"/>
  <circle cx="68" cy="58" r="3.8" fill="#23302A"/>
  <circle cx="90" cy="58" r="3.8" fill="#23302A"/>
  <circle cx="69.3" cy="56.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="91.3" cy="56.7" r="1.3" fill="#FFFFFF"/>
  <path d="M74 82 Q66 96 70 110" stroke="#B8AE97" stroke-width="2.6" fill="none"/>
  <path d="M84 82 Q92 96 88 110" stroke="#B8AE97" stroke-width="2.6" fill="none"/>
  <rect x="67" y="108" width="24" height="12" rx="6" fill="#C9A227"/>
  <circle cx="86" cy="114" r="2.6" fill="#8A6A15"/>` },

PGLA: { animal: "ホシガラス", item: "肩に掛けたザイル", svg: `
  <ellipse cx="106" cy="118" rx="23" ry="10" fill="#33302B" transform="rotate(16 106 118)"/>
  <ellipse cx="78" cy="104" rx="36" ry="33" fill="#6A5A4E"/>
  <circle cx="64" cy="97" r="2.7" fill="#F2EDE3"/>
  <circle cx="81" cy="93" r="2.7" fill="#F2EDE3"/>
  <circle cx="95" cy="102" r="2.7" fill="#F2EDE3"/>
  <circle cx="71" cy="114" r="2.7" fill="#F2EDE3"/>
  <circle cx="88" cy="121" r="2.7" fill="#F2EDE3"/>
  <ellipse cx="52" cy="106" rx="14" ry="24" fill="#33302B" transform="rotate(-8 52 106)"/>
  <rect x="68" y="132" width="9" height="15" rx="4" fill="#4A443C"/>
  <rect x="86" y="132" width="9" height="15" rx="4" fill="#4A443C"/>
  <circle cx="79" cy="60" r="24" fill="#6A5A4E"/>
  <path d="M73 65 L85 65 L79 87 Z" fill="#2E2A25"/>
  <circle cx="68" cy="56" r="3.8" fill="#211C17"/>
  <circle cx="90" cy="56" r="3.8" fill="#211C17"/>
  <circle cx="69.3" cy="54.6" r="1.4" fill="#FFFFFF"/>
  <circle cx="91.3" cy="54.6" r="1.4" fill="#FFFFFF"/>
  <!-- 肩から掛けたザイル（束ねたロープ） -->
  <path d="M66 80 Q46 94 42 112" stroke="#C9A227" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="118" rx="15" ry="11" fill="none" stroke="#C9A227" stroke-width="6"/>
  <ellipse cx="40" cy="118" rx="15" ry="11" fill="none" stroke="#E0A33B" stroke-width="2.4"/>
  <ellipse cx="40" cy="118" rx="7" ry="5" fill="none" stroke="#C9A227" stroke-width="5"/>
  <path d="M32 112 L48 124 M32 124 L48 112" stroke="#A8871B" stroke-width="1.6"/>` },

PGFC: { animal: "イワツバメ", item: "肩掛けのファーストエイドポーチ", svg: `
  <path d="M68 104 Q80 100 92 104 Q104 124 110 150 Q80 130 50 150 Q56 124 68 104 Z" fill="#2C3A50"/>
  <path d="M72 92 Q46 88 24 100 Q8 110 6 122 Q30 110 52 114 Q62 106 72 100 Z" fill="#2C3A50"/>
  <path d="M88 92 Q114 88 136 100 Q152 110 154 122 Q130 110 108 114 Q98 106 88 100 Z" fill="#2C3A50"/>
  <rect x="68" y="126" width="7" height="12" rx="3.5" fill="#C9A98A"/>
  <rect x="85" y="126" width="7" height="12" rx="3.5" fill="#C9A98A"/>
  <ellipse cx="80" cy="102" rx="31" ry="30" fill="#3A4A63"/>
  <ellipse cx="80" cy="110" rx="22" ry="22" fill="#FAF8F3"/>
  <circle cx="80" cy="58" r="25" fill="#3A4A63"/>
  <path d="M80 72 Q67 78 69 86 Q80 82 91 86 Q93 78 80 72 Z" fill="#FAF8F3"/>
  <path d="M74 62 L86 62 L80 72 Z" fill="#E3B24A"/>
  <circle cx="68" cy="54" r="5" fill="#FAF8F3"/>
  <circle cx="92" cy="54" r="5" fill="#FAF8F3"/>
  <circle cx="68" cy="54" r="3" fill="#141A24"/>
  <circle cx="92" cy="54" r="3" fill="#141A24"/>
  <circle cx="69.1" cy="52.9" r="1.1" fill="#FFFFFF"/>
  <circle cx="93.1" cy="52.9" r="1.1" fill="#FFFFFF"/>
  <path d="M68 84 Q74 104 94 116" stroke="#8A6A4E" stroke-width="3.6" fill="none" stroke-linecap="round"/>
  <rect x="86" y="112" width="24" height="19" rx="5" fill="#C2452C"/>
  <rect x="86" y="112" width="24" height="5.5" rx="2" fill="#A83A24"/>
  <path d="M98 119 L98 128 M93.5 123.5 L102.5 123.5" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>` },

PGFA: { animal: "ニホンザル", item: "缶ビール", svg: `
  <ellipse cx="112" cy="132" rx="20" ry="7" fill="#A8895F" transform="rotate(-14 112 132)"/>
  <rect x="58" y="132" width="15" height="18" rx="7.5" fill="#8A6E44"/>
  <rect x="87" y="132" width="15" height="18" rx="7.5" fill="#8A6E44"/>
  <ellipse cx="80" cy="113" rx="36" ry="30" fill="#A8895F"/>
  <ellipse cx="78" cy="119" rx="21" ry="20" fill="#CBB184"/>
  <ellipse cx="50" cy="116" rx="10" ry="13" fill="#8A6E44" transform="rotate(-18 50 116)"/>
  <!-- 耳 -->
  <circle cx="49" cy="62" r="11" fill="#9A7C50"/>
  <circle cx="111" cy="62" r="11" fill="#9A7C50"/>
  <circle cx="49" cy="62" r="5.5" fill="#EDAEA8"/>
  <circle cx="111" cy="62" r="5.5" fill="#EDAEA8"/>
  <!-- 頭 -->
  <circle cx="80" cy="62" r="32" fill="#A8895F"/>
  <path d="M80 30 Q58 34 51 50 Q68 40 80 40 Q92 40 109 50 Q102 34 80 30 Z" fill="#C2A578"/>
  <!-- 顔（下ぶくれの輪郭） -->
  <path d="M80 42 Q99 44 101 62 Q103 82 80 86 Q57 82 59 62 Q61 44 80 42 Z" fill="#F4A8A2"/>
  <!-- 目 -->
  <ellipse cx="71" cy="62" rx="5.4" ry="5.8" fill="#2C2018"/>
  <ellipse cx="89" cy="62" rx="5.4" ry="5.8" fill="#2C2018"/>
  <circle cx="72.8" cy="60" r="2" fill="#FFFFFF"/>
  <circle cx="90.8" cy="60" r="2" fill="#FFFFFF"/>
  <!-- 鼻と口 -->
  <ellipse cx="77.4" cy="72" rx="1.5" ry="1.2" fill="#D9857F"/>
  <ellipse cx="82.6" cy="72" rx="1.5" ry="1.2" fill="#D9857F"/>
  <path d="M74 78 Q80 82 86 78" stroke="#CE7A74" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <ellipse cx="63" cy="72" rx="4.4" ry="3.2" fill="#EE938C" opacity=".75"/>
  <ellipse cx="97" cy="72" rx="4.4" ry="3.2" fill="#EE938C" opacity=".75"/>
  <!-- 缶ビール -->
  <rect x="96" y="100" width="21" height="31" rx="4" fill="#E0CB84"/>
  <rect x="96" y="100" width="11" height="31" rx="4" fill="#F0E2A8"/>
  <rect x="96" y="109" width="21" height="9" fill="#C2452C"/>
  <ellipse cx="106.5" cy="100" rx="10.5" ry="3.2" fill="#B8B2A6"/>
  <ellipse cx="112" cy="120" rx="10" ry="12" fill="#8A6E44"/>` },

/* ---------- E・S 森×単独 ---------- */
ESLC: { animal: "ヤマネ", item: "文庫本", svg: `
  <path d="M94 128 Q130 130 127 108" stroke="#C0A276" stroke-width="15" fill="none" stroke-linecap="round"/>
  <path d="M104 126 Q126 128 125 112" stroke="#9A805C" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="64" cy="136" rx="10" ry="7" fill="#A98A60"/>
  <ellipse cx="88" cy="136" rx="10" ry="7" fill="#A98A60"/>
  <ellipse cx="76" cy="116" rx="27" ry="25" fill="#C0A276"/>
  <rect x="72" y="94" width="9" height="24" rx="4" fill="#6B563C"/>
  <ellipse cx="76" cy="124" rx="17" ry="15" fill="#F2E7D7"/>
  <circle cx="50" cy="56" r="16" fill="#A98A60"/>
  <circle cx="102" cy="56" r="16" fill="#A98A60"/>
  <circle cx="50" cy="56" r="9" fill="#E2C4A8"/>
  <circle cx="102" cy="56" r="9" fill="#E2C4A8"/>
  <circle cx="76" cy="68" r="27" fill="#CDB088"/>
  <path d="M76 41 L80 62 L72 62 Z" fill="#6B563C"/>
  <ellipse cx="76" cy="82" rx="12" ry="9" fill="#F7EFE0"/>
  <ellipse cx="76" cy="77" rx="4" ry="3" fill="#3A2E20"/>
  <path d="M62 80 L46 76 M62 84 L46 86" stroke="#B49A74" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M90 80 L106 76 M90 84 L106 86" stroke="#B49A74" stroke-width="1.6" stroke-linecap="round"/>
  <ellipse cx="64" cy="64" rx="6.5" ry="7" fill="#2A2016"/>
  <ellipse cx="88" cy="64" rx="6.5" ry="7" fill="#2A2016"/>
  <circle cx="66" cy="61.5" r="2.1" fill="#F2E7D7"/>
  <circle cx="90" cy="61.5" r="2.1" fill="#F2E7D7"/>
  <!-- 文庫本（縦長）を両手で持つ -->
  <rect x="64" y="96" width="25" height="36" rx="2" fill="#2E4654"/>
  <rect x="67" y="96" width="22" height="36" rx="2" fill="#3E5A68"/>
  <rect x="70" y="100" width="16" height="28" rx="1.2" fill="#4E6B7A"/>
  <path d="M73 106 L83 106 M73 110 L83 110" stroke="#7A9AAC" stroke-width="1.3" stroke-linecap="round"/>
  <text x="78" y="123" text-anchor="middle" font-family="Outfit, sans-serif"
        font-size="6.6" font-weight="700" fill="#EDF3F6">Novel</text>
  <path d="M89 97 L89 131" stroke="#E9E4D8" stroke-width="2.2"/>
  <!-- 本の縁をつかむ両手 -->
  <ellipse cx="59" cy="119" rx="8.5" ry="9.5" fill="#A98A60"/>
  <ellipse cx="97" cy="119" rx="8.5" ry="9.5" fill="#A98A60"/>
  <ellipse cx="65" cy="115" rx="4.4" ry="6" fill="#C0A276" transform="rotate(-12 65 115)"/>
  <ellipse cx="91" cy="115" rx="4.4" ry="6" fill="#C0A276" transform="rotate(12 91 115)"/>` },

ESLA: { animal: "ムササビ", item: "首に巻いた手ぬぐい", svg: `
  <path d="M100 126 Q138 124 134 102" stroke="#8E8478" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M22 128 Q10 86 44 66 L116 66 Q150 86 138 128 Q112 140 80 140 Q48 140 22 128 Z" fill="#A79C8E"/>
  <path d="M30 122 Q22 92 48 76 M130 122 Q138 92 112 76" stroke="#8E8478" stroke-width="2.4" fill="none"/>
  <ellipse cx="26" cy="126" rx="9" ry="7" fill="#7A7166" transform="rotate(-20 26 126)"/>
  <ellipse cx="134" cy="126" rx="9" ry="7" fill="#7A7166" transform="rotate(20 134 126)"/>
  <ellipse cx="67" cy="136" rx="10" ry="7" fill="#7A7166"/>
  <ellipse cx="93" cy="136" rx="10" ry="7" fill="#7A7166"/>
  <ellipse cx="80" cy="112" rx="29" ry="27" fill="#8E8478"/>
  <ellipse cx="80" cy="120" rx="18" ry="16" fill="#F0EAE0"/>
  <circle cx="58" cy="52" r="10" fill="#7A7166"/>
  <circle cx="102" cy="52" r="10" fill="#7A7166"/>
  <circle cx="80" cy="66" r="27" fill="#9A9084"/>
  <ellipse cx="80" cy="79" rx="11" ry="8" fill="#F0EAE0"/>
  <ellipse cx="80" cy="75" rx="3.8" ry="2.9" fill="#2E2A24"/>
  <circle cx="67" cy="63" r="6.6" fill="#231F1A"/>
  <circle cx="93" cy="63" r="6.6" fill="#231F1A"/>
  <circle cx="69.2" cy="60.6" r="2.2" fill="#F0EAE0"/>
  <circle cx="95.2" cy="60.6" r="2.2" fill="#F0EAE0"/>
  <!-- 首にかけて前で束ねた手ぬぐい（細く垂らす） -->
  <path d="M66 86 Q70 94 76 98 L84 98 Q90 94 94 86 Q80 92 66 86 Z" fill="#EDE7D8"/>
  <path d="M76 102 L73 128 L81 127 L80 102 Z" fill="#F4EFE3"/>
  <path d="M84 102 L87 128 L81 127 L80 102 Z" fill="#E2DAC6"/>
  <circle cx="77" cy="112" r="2.4" fill="#C4563E"/>
  <circle cx="84" cy="119" r="2.4" fill="#C4563E"/>
  <circle cx="76" cy="123" r="1.9" fill="#C4563E"/>
  <path d="M74 127 L81 126 L87 127" stroke="#D2C8B0" stroke-width="1.4" fill="none"/>
  <ellipse cx="80" cy="100" rx="6.5" ry="4" fill="#3E4A52"/>
  <ellipse cx="80" cy="99.4" rx="3.8" ry="2" fill="#5C7E90"/>` },

ESFC: { animal: "ホンドタヌキ", item: "湯気の立つマグカップ", svg: `
  <ellipse cx="116" cy="124" rx="23" ry="10" fill="#8A7259" transform="rotate(-12 116 124)"/>
  <ellipse cx="134" cy="119" rx="7" ry="8" fill="#4A3B2C"/>
  <ellipse cx="64" cy="139" rx="11" ry="7.5" fill="#6F5B44"/>
  <ellipse cx="92" cy="139" rx="11" ry="7.5" fill="#6F5B44"/>
  <ellipse cx="78" cy="112" rx="37" ry="32" fill="#8A7259"/>
  <ellipse cx="78" cy="120" rx="22" ry="21" fill="#CDBCA1"/>
  <ellipse cx="50" cy="118" rx="9" ry="12" fill="#6F5B44" transform="rotate(-18 50 118)"/>
  <circle cx="57" cy="46" r="11" fill="#6F5B44"/>
  <circle cx="101" cy="46" r="11" fill="#6F5B44"/>
  <circle cx="79" cy="64" r="29" fill="#97806A"/>
  <ellipse cx="65" cy="62" rx="12" ry="10" fill="#4A3B2C" transform="rotate(-16 65 62)"/>
  <ellipse cx="93" cy="62" rx="12" ry="10" fill="#4A3B2C" transform="rotate(16 93 62)"/>
  <ellipse cx="79" cy="78" rx="12" ry="9" fill="#E4DACB"/>
  <ellipse cx="79" cy="74" rx="4.2" ry="3.2" fill="#2C231B"/>
  <circle cx="66" cy="61" r="4.4" fill="#F2ECE2"/>
  <circle cx="92" cy="61" r="4.4" fill="#F2ECE2"/>
  <circle cx="66" cy="61.4" r="2.6" fill="#2A211A"/>
  <circle cx="92" cy="61.4" r="2.6" fill="#2A211A"/>
  <circle cx="67" cy="60.2" r="1.1" fill="#FFFFFF"/>
  <circle cx="93" cy="60.2" r="1.1" fill="#FFFFFF"/>
  <!-- 湯気（小さめ、顔にかからない高さ） -->
  <path d="M71 105 Q67 101 71 97 Q75 93 71 89" stroke="#CFC9BA" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M79 103 Q75 99 79 95 Q83 91 79 87" stroke="#CFC9BA" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M87 105 Q83 101 87 97 Q91 93 87 89" stroke="#CFC9BA" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- 取っ手 -->
  <path d="M91 116 Q104 121 91 127" stroke="#DCD5C6" stroke-width="6" fill="none"/>
  <path d="M91 118 Q100 121 91 125" stroke="#F7F5EF" stroke-width="2.6" fill="none"/>
  <!-- 本体（小さめ・立体感） -->
  <rect x="65" y="109" width="27" height="24" rx="5" fill="#E4E0D6"/>
  <rect x="65" y="109" width="18" height="24" rx="5" fill="#F9F8F4"/>
  <rect x="65" y="109" width="27" height="8" rx="4" fill="#4E6B7A"/>
  <ellipse cx="78.5" cy="112" rx="13.5" ry="4" fill="#3E5A68"/>
  <ellipse cx="78.5" cy="111.5" rx="10" ry="2.8" fill="#7A5A3C"/>
  <ellipse cx="107" cy="121" rx="9" ry="11" fill="#6F5B44"/>` },

ESFA: { animal: "ホンドギツネ", item: "道で摘んだ一輪の花", svg: `
  <path d="M92 128 Q137 127 132 103" stroke="#C4703A" stroke-width="15" fill="none" stroke-linecap="round"/>
  <circle cx="132" cy="101" r="8.5" fill="#F4EDE2"/>
  <rect x="62" y="132" width="11" height="16" rx="5" fill="#A85832"/>
  <rect x="87" y="132" width="11" height="16" rx="5" fill="#A85832"/>
  <ellipse cx="78" cy="112" rx="32" ry="29" fill="#C4703A"/>
  <ellipse cx="78" cy="120" rx="20" ry="18" fill="#F4EDE2"/>
  <path d="M54 58 L47 23 L74 46 Z" fill="#C4703A"/>
  <path d="M47 23 L52 41 L61 34 Z" fill="#4A3B2C"/>
  <path d="M104 58 L111 23 L84 46 Z" fill="#C4703A"/>
  <path d="M111 23 L106 41 L97 34 Z" fill="#4A3B2C"/>
  <circle cx="79" cy="64" r="26" fill="#D07F45"/>
  <path d="M79 51 Q63 66 79 89 Q95 66 79 51 Z" fill="#F4EDE2"/>
  <ellipse cx="79" cy="82" rx="4.2" ry="3.1" fill="#2E2118"/>
  <circle cx="67" cy="62" r="3.8" fill="#241A12"/>
  <circle cx="91" cy="62" r="3.8" fill="#241A12"/>
  <circle cx="68.3" cy="60.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="92.3" cy="60.7" r="1.3" fill="#FFFFFF"/>
  <!-- 茎（斜めに構えて顔を避ける） -->
  <path d="M68 132 Q84 122 100 106" stroke="#6E8B5E" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  <path d="M84 120 Q80 110 86 106" stroke="#6E8B5E" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <path d="M86 106 Q80 104 80 110 Q86 112 86 106 Z" fill="#6E8B5E"/>
  <!-- 花 -->
  <circle cx="104" cy="94" r="6" fill="#EBD3E2"/>
  <circle cx="113" cy="99" r="6" fill="#EBD3E2"/>
  <circle cx="110" cy="109" r="6" fill="#EBD3E2"/>
  <circle cx="99" cy="110" r="6" fill="#EBD3E2"/>
  <circle cx="96" cy="100" r="6" fill="#EBD3E2"/>
  <circle cx="104.5" cy="102" r="4.4" fill="#E0A33B"/>
  <!-- 茎を握る両手 -->
  <ellipse cx="62" cy="120" rx="9" ry="10" fill="#A85832"/>
  <ellipse cx="78" cy="126" rx="9" ry="10" fill="#A85832"/>` },

/* ---------- E・G 森×群れ ---------- */
EGLC: { animal: "ニホンジカ", item: "先導用の小旗", svg: `
  <rect x="62" y="130" width="11" height="18" rx="5" fill="#8A6238"/>
  <rect x="87" y="130" width="11" height="18" rx="5" fill="#8A6238"/>
  <ellipse cx="78" cy="112" rx="33" ry="30" fill="#A5764A"/>
  <circle cx="60" cy="106" r="2.8" fill="#EFE3D0"/>
  <circle cx="72" cy="100" r="2.8" fill="#EFE3D0"/>
  <circle cx="96" cy="104" r="2.8" fill="#EFE3D0"/>
  <circle cx="102" cy="116" r="2.8" fill="#EFE3D0"/>
  <ellipse cx="78" cy="122" rx="20" ry="17" fill="#EFE3D0"/>
  <path d="M66 58 Q57 32 62 13" stroke="#8A6A45" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M63 31 Q53 27 47 18" stroke="#8A6A45" stroke-width="4.4" fill="none" stroke-linecap="round"/>
  <path d="M92 58 Q101 32 96 13" stroke="#8A6A45" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M95 31 Q105 27 111 18" stroke="#8A6A45" stroke-width="4.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="58" cy="64" rx="9.5" ry="13" fill="#8A6238" transform="rotate(-30 58 64)"/>
  <ellipse cx="100" cy="64" rx="9.5" ry="13" fill="#8A6238" transform="rotate(30 100 64)"/>
  <ellipse cx="79" cy="70" rx="24" ry="27" fill="#B4855A"/>
  <ellipse cx="79" cy="86" rx="13" ry="11" fill="#EFE3D0"/>
  <ellipse cx="79" cy="82" rx="4.4" ry="3.3" fill="#3A2A1C"/>
  <circle cx="68" cy="67" r="3.8" fill="#2A1E14"/>
  <circle cx="90" cy="67" r="3.8" fill="#2A1E14"/>
  <circle cx="69.3" cy="65.7" r="1.3" fill="#FFFFFF"/>
  <circle cx="91.3" cy="65.7" r="1.3" fill="#FFFFFF"/>
  <!-- 旗（体の横で持つ） -->
  <rect x="112" y="58" width="5" height="80" rx="2.5" fill="#8A7259"/>
  <path d="M117 62 L148 73 L117 84 Z" fill="#C2452C"/>
  <path d="M117 62 L148 73 L117 73 Z" fill="#D45C40"/>
  <!-- 両手（右手で旗をにぎる） -->
  <ellipse cx="56" cy="118" rx="9" ry="10" fill="#8A6238"/>
  <ellipse cx="108" cy="110" rx="10" ry="11" fill="#8A6238" transform="rotate(14 108 110)"/>` },

EGLA: { animal: "ヤマセミ", item: "三脚つきの一眼カメラ", svg: `
  <!-- 尾羽 -->
  <path d="M102 114 Q128 118 140 132 Q120 132 104 126 Z" fill="#3A3A38"/>
  <!-- 胴 -->
  <ellipse cx="78" cy="104" rx="34" ry="32" fill="#3A3A38"/>
  <ellipse cx="77" cy="114" rx="22" ry="21" fill="#F7F5F0"/>
  <g fill="#F7F5F0">
    <rect x="54" y="88" width="8" height="4.6" rx="2.3" transform="rotate(-12 54 88)"/>
    <rect x="70" y="84" width="8" height="4.6" rx="2.3"/>
    <rect x="90" y="90" width="8" height="4.6" rx="2.3" transform="rotate(12 90 90)"/>
    <rect x="50" y="104" width="8" height="4.6" rx="2.3" transform="rotate(-6 50 104)"/>
    <rect x="98" y="106" width="8" height="4.6" rx="2.3" transform="rotate(6 98 106)"/>
  </g>
  <!-- 足 -->
  <rect x="66" y="132" width="9" height="15" rx="4" fill="#B8AE97"/>
  <rect x="85" y="132" width="9" height="15" rx="4" fill="#B8AE97"/>
  <!-- 冠羽（丸みのある3本） -->
  <path d="M62 48 Q56 30 66 22 Q68 36 72 44 Z" fill="#3A3A38"/>
  <path d="M72 44 Q72 22 80 16 Q79 32 84 44 Z" fill="#3A3A38"/>
  <path d="M84 44 Q90 26 100 22 Q91 36 93 48 Z" fill="#3A3A38"/>
  <!-- 頭 -->
  <circle cx="78" cy="60" r="25" fill="#3A3A38"/>
  <path d="M57 64 Q63 74 73 76 Q67 64 65 54 Z" fill="#F7F5F0"/>
  <path d="M99 64 Q93 74 83 76 Q89 64 91 54 Z" fill="#F7F5F0"/>
  <!-- 胸の帯 -->
  <path d="M66 80 Q78 74 90 80 Q88 90 78 92 Q68 90 66 80 Z" fill="#E4C79A"/>
  <!-- くちばし（短めでかわいく） -->
  <path d="M72 66 L85 66 Q83 78 78 82 Q74 78 72 66 Z" fill="#5B5B57"/>
  <!-- 目（大きく丸く） -->
  <circle cx="67" cy="55" r="7.4" fill="#F7F5F0"/>
  <circle cx="89" cy="55" r="7.4" fill="#F7F5F0"/>
  <circle cx="67" cy="55" r="4.6" fill="#1E1D1A"/>
  <circle cx="89" cy="55" r="4.6" fill="#1E1D1A"/>
  <circle cx="68.8" cy="53.2" r="1.9" fill="#FFFFFF"/>
  <circle cx="90.8" cy="53.2" r="1.9" fill="#FFFFFF"/>
  <!-- カメラと三脚 -->
  <path d="M62 130 L52 152 M94 130 L104 152 M78 130 L78 152" stroke="#5B5B57" stroke-width="4.4" stroke-linecap="round"/>
  <rect x="84" y="106" width="9" height="6" rx="2" fill="#3E4A52"/>
  <rect x="58" y="111" width="38" height="23" rx="5" fill="#3E4A52"/>
  <circle cx="77" cy="122" r="8.6" fill="#2A3238"/>
  <circle cx="77" cy="122" r="4.4" fill="#8FA6B4"/>
  <circle cx="79" cy="120" r="1.6" fill="#C7D8E2"/>` },

EGFC: { animal: "ニホンリス", item: "みんなに配るどんぐり", svg: `
  <path d="M88 130 Q148 126 141 76 Q135 42 106 48 Q130 56 128 82 Q126 118 86 118 Z" fill="#C77A4A"/>
  <ellipse cx="74" cy="108" rx="31" ry="31" fill="#B5643C"/>
  <ellipse cx="74" cy="116" rx="19" ry="19" fill="#F2E7D7"/>
  <ellipse cx="58" cy="137" rx="10" ry="7" fill="#A85832"/>
  <ellipse cx="88" cy="137" rx="10" ry="7" fill="#A85832"/>
  <path d="M58 52 L51 20 L72 42 Z" fill="#A85832"/>
  <path d="M94 52 L101 20 L80 42 Z" fill="#A85832"/>
  <circle cx="75" cy="62" r="26" fill="#BE6D42"/>
  <ellipse cx="75" cy="76" rx="12" ry="9" fill="#F2E7D7"/>
  <ellipse cx="75" cy="71" rx="4" ry="3" fill="#3A241A"/>
  <circle cx="64" cy="59" r="4.2" fill="#2B1B12"/>
  <circle cx="86" cy="59" r="4.2" fill="#2B1B12"/>
  <circle cx="65.4" cy="57.6" r="1.4" fill="#FFFFFF"/>
  <circle cx="87.4" cy="57.6" r="1.4" fill="#FFFFFF"/>
  <!-- 抱える両手（どんぐりの後ろ） -->
  <ellipse cx="56" cy="116" rx="9" ry="10.5" fill="#A85832" transform="rotate(-18 56 116)"/>
  <ellipse cx="94" cy="116" rx="9" ry="10.5" fill="#A85832" transform="rotate(18 94 116)"/>
  <!-- どんぐり3個（立体感） -->
  <g>
    <ellipse cx="62" cy="108" rx="8" ry="10" fill="#B98F52" transform="rotate(-14 62 108)"/>
    <ellipse cx="60" cy="107" rx="4.2" ry="7" fill="#D4AE76" transform="rotate(-14 60 107)"/>
    <path d="M54 101 Q62 94 70 100 Q62 104 54 101 Z" fill="#6B4A26" transform="rotate(-14 62 100)"/>
    <path d="M62 93 L62 89" stroke="#6B4A26" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g>
    <ellipse cx="88" cy="108" rx="8" ry="10" fill="#B98F52" transform="rotate(14 88 108)"/>
    <ellipse cx="86" cy="107" rx="4.2" ry="7" fill="#D4AE76" transform="rotate(14 86 107)"/>
    <path d="M80 101 Q88 94 96 100 Q88 104 80 101 Z" fill="#6B4A26" transform="rotate(14 88 100)"/>
    <path d="M90 93 L91 89" stroke="#6B4A26" stroke-width="2" stroke-linecap="round"/>
  </g>
  <g>
    <ellipse cx="75" cy="114" rx="9.5" ry="12" fill="#C9A26B"/>
    <ellipse cx="72" cy="113" rx="5" ry="8.4" fill="#E0BE88"/>
    <path d="M65 106 Q75 98 85 106 Q75 111 65 106 Z" fill="#7A5A33"/>
    <path d="M75 98 L75 93" stroke="#7A5A33" stroke-width="2.4" stroke-linecap="round"/>
  </g>
  <!-- 手前の指 -->
  <ellipse cx="62" cy="120" rx="6" ry="6.5" fill="#C06A42" transform="rotate(-18 62 120)"/>
  <ellipse cx="88" cy="120" rx="6" ry="6.5" fill="#C06A42" transform="rotate(18 88 120)"/>` },

EGFA: { animal: "ノウサギ", item: "自撮り棒つきスマホ", svg: `
  <ellipse cx="107" cy="128" rx="11" ry="9" fill="#F2ECE2"/>
  <rect x="64" y="132" width="12" height="16" rx="6" fill="#96866F"/>
  <rect x="86" y="132" width="12" height="16" rx="6" fill="#96866F"/>
  <ellipse cx="78" cy="112" rx="31" ry="29" fill="#AE9C86"/>
  <ellipse cx="78" cy="120" rx="20" ry="18" fill="#F2ECE2"/>
  <ellipse cx="62" cy="34" rx="9" ry="26" fill="#AE9C86" transform="rotate(-12 62 34)"/>
  <ellipse cx="62" cy="36" rx="4.5" ry="19" fill="#D9BFB2" transform="rotate(-12 62 36)"/>
  <ellipse cx="96" cy="34" rx="9" ry="26" fill="#AE9C86" transform="rotate(12 96 34)"/>
  <ellipse cx="96" cy="36" rx="4.5" ry="19" fill="#D9BFB2" transform="rotate(12 96 36)"/>
  <circle cx="79" cy="72" r="26" fill="#BCAB95"/>
  <ellipse cx="79" cy="84" rx="11" ry="8" fill="#F6F1E8"/>
  <ellipse cx="79" cy="79" rx="3.6" ry="2.6" fill="#3A3027"/>
  <path d="M79 81 L75 85 M79 81 L83 85" stroke="#3A3027" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="67" cy="70" r="4" fill="#2A241C"/>
  <circle cx="91" cy="70" r="4" fill="#2A241C"/>
  <circle cx="68.4" cy="68.6" r="1.4" fill="#FFFFFF"/>
  <circle cx="92.4" cy="68.6" r="1.4" fill="#FFFFFF"/>
  <path d="M44 142 Q66 124 92 108" stroke="#5B5B57" stroke-width="5" stroke-linecap="round" fill="none"/>
  <g transform="rotate(18 104 96)">
    <rect x="90" y="78" width="27" height="38" rx="5" fill="#2A3238"/>
    <rect x="94" y="83" width="19" height="28" rx="2" fill="#9DB6C4"/>
  </g>
  <ellipse cx="58" cy="128" rx="8" ry="9" fill="#96866F"/>` },

};

/* ---------- キャラクターのSVGを組み立てる ----------
   高山の生き物は青緑の背景、森の生き物はベージュの背景 */
/* ---------- 4系統の色 ----------
   目的軸（高山 P / 森 E）× 仲間軸（単独 S / 群れ G）で4分類。
   band  : ページ背景に敷く淡色
   circle: キャラクターの背景円（bandより一段淡い）
   deep  : コードのプレート色（白抜き文字）*/
const GROUPS = {
  PS: { name: "孤峰",   lead: "自分の足で、頂へ"     , axis: "ピークハント × ソロ",
        band: "#E3EBF0", circle: "#E3EDF3", deep: "#3E5C6E" },
  PG: { name: "連峰",   lead: "仲間と、峰から峰へ"   , axis: "ピークハント × グループ",
        band: "#F3E6E1", circle: "#F5E7E1", deep: "#B5533A" },
  ES: { name: "樹林帯", lead: "静かな森を、ひとりで"  , axis: "エンジョイ × ソロ",
        band: "#E2ECE4", circle: "#E1EDE5", deep: "#4E7A57" },
  EG: { name: "高原",   lead: "開けた場所で、仲間と"  , axis: "エンジョイ × グループ",
        band: "#F4EBDB", circle: "#F6EDDC", deep: "#A5761F" },
};

/* コードから系統を引く（PSLC → PS） */
function groupOf(code) {
  return GROUPS[code.slice(0, 2)] || GROUPS.PS;
}

function characterSVG(code, cls, noBadge) {
  const c = CHARACTERS[code];
  if (!c) return "";
  const bg = groupOf(code).circle;
  const badge = noBadge ? "" : `<circle cx="80" cy="80" r="76" fill="${bg}"/>`;
  const label = noBadge ? `aria-hidden="true"` : `role="img" aria-label="${c.animal}"`;
  return `<svg viewBox="0 0 160 160" class="${cls || "char"}" ${label}>${badge}${c.svg}</svg>`;
}
