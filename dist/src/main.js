const $sitelist = $('.sitelist')
const $lastli = $sitelist.find('.lastli')
// 下拉菜单子元素
const $dropdownChildren = $('.dropdown-content').children()
const $dropdownFirst = $('.search-dropdown').find('a')[0]
// 获取form和input元素以便更改属性
const $formAction = $('.search')
const $inputName = $('.methodname')
// 获取导航栏的所有li
const $navList = $('.nav-list').find('li')

// 将本地存储的hashmap转换成对象
const x = localStorage.getItem('x')
const xObject = JSON.parse(x)
// 保存添加的简称和网站
const hashmap = xObject || [
  { logo: 'B', url: 'https://bilibili.com' },
  { logo: 'G', url: 'https://github.com/' },
  { logo: 'Z', url: 'https://zhihu.com/' },
]
// 保存要搜索的网站和网站索引
const NameAndSearch = [
  {
    search: '谷歌',
    name: 'q',
  },
  {
    search: '必应',
    name: 'q',
  },
  {
    search: '百度',
    name: 'word',
  },
]
const searchHash = [
  {
    0: 'https://www.google.com.hk/search?',
    1: 'https://www.google.com.hk/imghp?',
    2: 'https://news.google.com/search?',
    3: 'https://www.google.com.hk/videohp?',
    4: 'https://www.google.com/maps/search/',
  },
  {
    0: 'https://cn.bing.com/search?',
    1: 'https://cn.bing.com/images/search?',
    2: 'https://news.microsoft.com/zh-cn/?',
    3: 'https://cn.bing.com/videos/search?',
    4: 'https://cn.bing.com/maps?',
  },
  {
    0: 'https://www.baidu.com/s',
    1: 'https://image.baidu.com/',
    2: 'https://news.baidu.com/',
    3: 'http://v.baidu.com/v',
    4: 'https://map.baidu.com/search',
  },
]
console.log(searchHash[1][0])
render()
$('.lastli').on('click', () => {
  let url = window.prompt('请输入要添加的网站')
  if (url.indexOf('http') !== 0) {
    url = 'https://' + url
  }
  hashmap.push({ logo: simplifyUrl(url)[0].toUpperCase(), url: url })
  render()
})

// 下拉菜单点击修改显示内容及action name
for (let i = 0; i < $dropdownChildren.length; i++) {
  let $dropchild = $dropdownChildren[i]
  let $droptext = $($dropchild).find('a').text()
  $($dropchild).on('click', () => {
    // 修改搜索引擎显示内容
    $($dropdownFirst).text($droptext)
    // 修改搜索引擎URL
    $($formAction).attr('action', searchHash[i][0])
    $($inputName).attr('name', NameAndSearch[i].name)
  })
}
// 点击导航栏修改action name
for (let i = 0; i < $navList.length; i++) {
  let navIndex = i
  let $navA = $($navList[i]).find('a')
  $($navA).on('click', () => {
    // 更改为选中状态并修改action
    if ('a:not($navA)') {
      // 保存哈希表索引
      let Searchindex
      $($navList).find('a').removeClass('checked')
      $navA.addClass('checked')
      // 对搜搜显示内容与哈希表索引进行判断 返回索引
      for (let j = 0; j < NameAndSearch.length; j++) {
        if ($($dropdownFirst).text() === NameAndSearch[j].search) {
          Searchindex = j
        }
      }
      $($formAction).attr('action', searchHash[Searchindex][i])
    }
  })
}
// 移除url多余字符串函数
function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www', '').replace(/\/.*/, '')
}

// 动态添加hashmap的函数
function render() {
  // 在每次动态添加之前 除了最后的添加元素，之前的都要删除
  $sitelist.find('li:not(.lastli)').remove()
  hashmap.forEach((node, index) => {
    const $li = $(`<li class="navspan"
      <div class="site">${node.logo}</div>
      <div class="link">${simplifyUrl(node.url)}</div>
      <span class="close">
        <svg class="icon">
          <use xlink:href="#icon-ziyuan"></use>
        </svg>
      </span>
  </li>`).insertBefore($lastli)
    $li.on('click', () => {
      window.open(node.url)
    })
    $li.on('click', '.close', e => {
      e.stopPropagation()
      hashmap.splice(index, 1)
      render()
    })
  })
}

// 在页面关闭时将hashmap转成字符串保存起来 以便下次渲染
window.onbeforeunload = () => {
  const string = JSON.stringify(hashmap)
  localStorage.setItem('x', string)
}

// $(document).on('keypress', e => {
//   const { key } = e
//   for (let i = 0; i < hashmap.length; i++) {
//     if (hashmap[i].logo.toLowerCase() === key) {
//       window.open(hashmap[i].url)
//     }
//   }
// })
