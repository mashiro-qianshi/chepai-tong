# -*- coding: utf-8 -*-
"""构建「地级市级别」中国地图 GeoJSON，供按城市点亮使用。
从 DataV 按省下载地级市边界 → 合并 → 与我方城市名匹配 → 输出 js/china_city.js
"""
import urllib.request, os, json, ssl, copy

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}


def get(url, timeout=120):
    req = urllib.request.Request(url, headers=UA)
    for verify in (True, False):
        try:
            ctx = ssl.create_default_context()
            if not verify:
                ctx.check_hostname = False
                ctx.verify_mode = ssl.CERT_NONE
            return urllib.request.urlopen(req, timeout=timeout, context=ctx)
        except Exception as e:
            if verify:
                continue
            raise


# 27 省：abbr, 省名, adcode, "城市:字母,..."
CITY_PROV = [
 ["冀", "河北", "130000", "石家庄:A,唐山:B,秦皇岛:C,邯郸:D,邢台:E,保定:F,张家口:G,承德:H,沧州:J,廊坊:R,衡水:T"],
 ["晋", "山西", "140000", "太原:A,大同:B,阳泉:C,长治:D,晋城:E,朔州:F,忻州:H,吕梁:J,晋中:K,临汾:L,运城:M"],
 ["蒙", "内蒙古", "150000", "呼和浩特:A,包头:B,乌海:C,赤峰:D,呼伦贝尔:E,兴安盟:F,通辽:G,锡林郭勒盟:H,乌兰察布:J,鄂尔多斯:K,巴彦淖尔:L,阿拉善盟:M"],
 ["辽", "辽宁", "210000", "沈阳:A,大连:B,鞍山:C,抚顺:D,本溪:E,丹东:F,锦州:G,营口:H,阜新:J,辽阳:K,盘锦:L,铁岭:M,朝阳:N,葫芦岛:P"],
 ["吉", "吉林", "220000", "长春:A,吉林市:B,四平:C,辽源:D,通化:E,白山:F,白城:G,延边州:H,松原:J"],
 ["黑", "黑龙江", "230000", "哈尔滨:A,齐齐哈尔:B,牡丹江:C,佳木斯:D,大庆:E,伊春:F,鸡西:G,鹤岗:H,双鸭山:J,七台河:K,绥化:L,大兴安岭:M,黑河:N"],
 ["苏", "江苏", "320000", "南京:A,无锡:B,徐州:C,常州:D,苏州:E,南通:F,连云港:G,淮安:H,盐城:J,扬州:K,镇江:L,泰州:M,宿迁:N"],
 ["浙", "浙江", "330000", "杭州:A,宁波:B,温州:C,绍兴:D,湖州:E,嘉兴:F,金华:G,衢州:H,台州:J,丽水:K,舟山:L"],
 ["皖", "安徽", "340000", "合肥:A,芜湖:B,蚌埠:C,淮南:D,马鞍山:E,淮北:F,铜陵:G,安庆:H,黄山:J,阜阳:K,宿州:L,滁州:M,六安:N,宣城:P,池州:R,亳州:S"],
 ["闽", "福建", "350000", "福州:A,莆田:B,泉州:C,厦门:D,漳州:E,龙岩:F,三明:G,南平:H,宁德:J"],
 ["赣", "江西", "360000", "南昌:A,赣州:B,宜春:C,吉安:D,上饶:E,抚州:F,九江:G,景德镇:H,萍乡:J,新余:K,鹰潭:L"],
 ["鲁", "山东", "370000", "济南:A,青岛:B,淄博:C,枣庄:D,东营:E,烟台:F,潍坊:G,济宁:H,泰安:J,威海:K,日照:L,滨州:M,德州:N,聊城:P,临沂:Q,菏泽:R"],
 ["豫", "河南", "410000", "郑州:A,开封:B,洛阳:C,平顶山:D,安阳:E,鹤壁:F,新乡:G,焦作:H,濮阳:J,许昌:K,漯河:L,三门峡:M,商丘:N,周口:P,驻马店:Q,南阳:R,信阳:S,济源:U"],
 ["鄂", "湖北", "420000", "武汉:A,黄石:B,十堰:C,荆州:D,宜昌:E,襄阳:F,鄂州:G,荆门:H,黄冈:J,孝感:K,咸宁:L,仙桃:M,潜江:N,神农架:P,恩施州:Q,天门:R,随州:S"],
 ["湘", "湖南", "430000", "长沙:A,株洲:B,湘潭:C,衡阳:D,邵阳:E,岳阳:F,张家界:G,益阳:H,常德:J,娄底:K,郴州:L,永州:M,怀化:N,湘西州:U"],
 ["粤", "广东", "440000", "广州:A,深圳:B,珠海:C,汕头:D,佛山:E,韶关:F,湛江:G,肇庆:H,江门:J,茂名:K,惠州:L,梅州:M,汕尾:N,河源:P,阳江:Q,清远:R,东莞:S,中山:T,潮州:U,揭阳:V,云浮:W"],
 ["桂", "广西", "450000", "南宁:A,柳州:B,桂林:C,梧州:D,北海:E,崇左:F,来宾:G,贺州:J,玉林:K,百色:L,河池:M,钦州:N,防城港:P,贵港:R"],
 ["琼", "海南", "460000", "海口:A,三亚:B,琼海:C,五指山:D,儋州:E"],
 ["川", "四川", "510000", "成都:A,绵阳:B,自贡:C,攀枝花:D,泸州:E,德阳:F,广元:H,遂宁:J,内江:K,乐山:L,资阳:M,宜宾:Q,南充:R,达州:S,雅安:T,阿坝州:U,甘孜州:V,凉山州:W,广安:X,巴中:Y,眉山:Z"],
 ["贵", "贵州", "520000", "贵阳:A,六盘水:B,遵义:C,铜仁:D,黔西南州:E,毕节:F,安顺:G,黔东南州:H,黔南州:J"],
 ["云", "云南", "530000", "昆明:A,昭通:C,曲靖:D,楚雄州:E,玉溪:F,红河州:G,文山州:H,普洱:J,西双版纳:K,大理:L,保山:M,德宏州:N,丽江:P,怒江州:Q,迪庆州:R,临沧:S"],
 ["藏", "西藏", "540000", "拉萨:A,昌都:B,山南:C,日喀则:D,那曲:E,阿里:F,林芝:G"],
 ["陕", "陕西", "610000", "西安:A,铜川:B,宝鸡:C,咸阳:D,渭南:E,汉中:F,安康:G,商洛:H,延安:J,榆林:K"],
 ["甘", "甘肃", "620000", "兰州:A,嘉峪关:B,金昌:C,白银:D,天水:E,酒泉:F,张掖:G,武威:H,定西:J,陇南:K,平凉:L,庆阳:M,临夏州:N,甘南州:P"],
 ["青", "青海", "630000", "西宁:A,海东:B,海北州:C,黄南州:D,海南州:E,果洛州:F,玉树州:G,海西州:H"],
 ["宁", "宁夏", "640000", "银川:A,石嘴山:B,吴忠:C,固原:D,中卫:E"],
 ["新", "新疆", "650000", "乌鲁木齐:A,昌吉州:B,石河子:C,奎屯:D,博州:E,伊犁州:F,塔城:G,阿勒泰:H,克拉玛依:J,吐鲁番:K,哈密:L,巴州:M,阿克苏:N,克州:P,喀什:Q,和田:R"],
]

# 单城地区（直辖市）：直接取省界多边形
SINGLE = [
 ["京", "北京", "110000", "A"],
 ["津", "天津", "120000", "A"],
 ["沪", "上海", "310000", "A"],
 ["渝", "重庆", "500000", "A"],
]

# 简称无法用「两字前缀」匹配的特例
OVERRIDES = {"博州": "博尔塔拉蒙古自治州", "巴州": "巴音郭楞蒙古自治州", "克州": "克孜勒苏柯尔克孜自治州"}

features = []
unmatched = []

# 1) 省界（用于直辖市）
prov_geo = json.loads(get('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json').read().decode('utf-8'))
for abbr, name, adcode, letter in SINGLE:
    hit = None
    for f in prov_geo['features']:
        if f['properties'].get('name', '').find(name) >= 0:
            hit = f
            break
    if hit:
        c = copy.deepcopy(hit)
        c['properties']['key'] = abbr + letter
        c['properties']['abbr'] = abbr
        c['properties']['letter'] = letter
        features.append(c)
    else:
        unmatched.append(name)

# 2) 27 省：地级市
for abbr, name, adcode, cities in CITY_PROV:
    url = 'https://geo.datav.aliyun.com/areas_v3/bound/%s_full.json' % adcode
    try:
        cg = json.loads(get(url).read().decode('utf-8'))
    except Exception as e:
        print('FAIL', name, e, flush=True)
        continue
    for item in cities.split(','):
        cname, letter = item.split(':')
        match = None
        for f in cg['features']:
            gname = f['properties'].get('name', '')
            if (cname in gname) or gname.startswith(cname[:2]) or OVERRIDES.get(cname) == gname:
                match = f
                break
        if match:
            c = copy.deepcopy(match)
            c['properties']['key'] = abbr + letter
            c['properties']['abbr'] = abbr
            c['properties']['letter'] = letter
            features.append(c)
        else:
            unmatched.append(name + ':' + cname)

# 保存
out = {"type": "FeatureCollection", "features": features}
jsdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'js')
os.makedirs(jsdir, exist_ok=True)
dst = os.path.join(jsdir, 'china_city.js')
with open(dst, 'w', encoding='utf-8') as fp:
    fp.write('window.CHINA_CITY_GEO = ' + json.dumps(out, ensure_ascii=False) + ';\n')
print('匹配到城市多边形:', len(features), flush=True)
print('未匹配:', unmatched, flush=True)
print('saved', dst, os.path.getsize(dst), 'bytes', flush=True)
