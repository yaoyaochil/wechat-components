<template>
  <div style="display: block;flex: 1;height: 100%">
    <el-row>
      <el-col :span="24">
        <div class="header-box">
          <div class="info_tips_wrap">
            <div class="icon suc_icon" />
          </div>
          <div class="content">
            <div class="in-content">
              <p class="title">菜单已发布</p>
              <p class="title">可在手机查看菜单内容，若尚未生效，请稍后查看。若停用菜单， <a
                style="color: rgba(13,132,255,0.79)"
                href="https://mp.weixin.qq.com/"
                target="_blank"
              >请前往微信官方公众平台</a></p>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="container-box">
          <!--      左侧菜单编辑器-->
          <div class="phone-box">
            <div class="menu__preview-hd" />
            <div class="menu__preview-bd">
              <div class="menu__preview-bottom">
                <div class="menu__keyboard">
                  <div class="menu__keyboard-icon" />
                </div>
                <div class="menu-list">
                  <el-button v-if="menu_data.button.length <= 0" link class="menu-add-no-menu" @click="addMainMenu">
                    <div class="add-no-menu">
                      <div class="menu__add-icon" />
                      <span>添加菜单</span>
                    </div>
                  </el-button>
                  <div
                    v-for="item in menu_data.button"
                    v-else
                    :key="item.id"
                    :class="`menu-list-item ${select_menu_id === item.id && select_menu_sub_id === 0?'menu-box-shadow':''}`"
                  >
                    <div class="menu__preview-line" />
                    <div
                      :class="`menu-item ${select_menu_id === item.id && select_menu_sub_id === 0?'menu-item-color':''}`"
                      @click="selectMenu(item.id)"
                    >{{ item.name }}
                    </div>
                    <!--                  二级菜单-->
                    <div v-if="select_menu_id === item.id" class="submenu">
                      <!--                    二级-->
                      <div
                        v-for="sub_item in item.sub_button"
                        :key="sub_item.id"
                        :class="`menu-item-sub ${select_menu_sub_id === sub_item.id?'menu-box-shadow menu-item-color':''} ${select_menu_sub_id !== sub_item.id?'menu-item-border-color':''}`"
                      >
                        <span
                          style="flex: 1;height: 100%;display: flex;justify-content: center;align-items: center"
                          @click="selectSubMenu(sub_item.id)"
                        >{{ sub_item.name }}</span>
                        <div class="sub-menu-bar">
                          <div v-if="select_menu_sub_id === sub_item.id" class="sub-menu-bar-box">
                            <div class="sub-center-bar bar-hover" @click="onDeleteSub" />
                          </div>
                        </div>
                      </div>
                      <!--                    二级增加按钮-->
                      <div v-if="item.sub_button.length < 5" class="add-button-sub">
                        <el-button link title="最多添加5个子菜单" @click="addMSubMenu">
                          <i class="icon15_menu_add" />
                          添加
                        </el-button>
                      </div>
                      <i
                        :class="`arrow arrow_out ${select_menu_sub_id === 5 && item.sub_button.length === 5?'arrow_out_select':''}`"
                      />
                      <i
                        :class="`arrow arrow_in ${select_menu_sub_id === 5 && item.sub_button.length === 5?'arrow_in_select':''}`"
                      />
                    </div>
                    <div class="menu-bar">
                      <div
                        v-if="select_menu_id === item.id"
                        :class="`menu-bar-box ${menu_data.button.length > 1?'bar-padding':''}`"
                      >
                        <div v-if="item.id !== menu_data.button[0].id" class="left-bar bar-hover" @click="onLeftMove" />
                        <div class="center-bar bar-hover" @click="onDelete" />
                        <div
                          v-if="menu_data.button[1] && item.id !== menu_data.button[1].id && menu_data.button.length === 2"
                          class="right-bar bar-hover"
                          @click="onRightMove"
                        />
                        <div
                          v-if="menu_data.button.length > 2 && item.id !== menu_data.button[2].id"
                          class="right-bar bar-hover"
                          @click="onRightMove"
                        />
                      </div>
                    </div>
                  </div>
                  <!--                  主菜单添加按钮-->
                  <div v-if="menu_data.button.length < 3 && menu_data.button.length > 0" class="add-button">
                    <div class="menu_button_preview-line" />
                    <el-button link @click="addMainMenu">
                      <i class="icon14_menu_add" />
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--        右侧编辑器-->
          <div class="right-editor-box">
            <div v-if="menu_data.button.length > 0" class="attribute-box">
              <!--              没有有二级菜单-->
              <div v-if="isHaveSubMenu() === false && select_menu_id !== 0 || select_menu_sub_id !== 0" class="custom-no-have-menu-box">
                <h3>菜单信息</h3>
                <el-form ref="formVisible" :model="formData" :rules="rule">
                  <div class="custom-menu-name">
                    <div class="input-title">名称</div>
                    <div class="input-box">
                      <el-form-item prop="name">
                        <el-input v-model="formData.name" placeholder="仅支持中文或数字" />
                        <p class="input-tip">仅支持中英文和数字，字数不超过4个汉字或8个字母。</p>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="custom-menu-type">
                    <div class="input-title">消息类型</div>
                    <el-radio-group v-model="menu_type" class="ml-4">
                      <el-radio label="click" size="large">推送事件消息</el-radio>
                      <el-radio label="view" size="large">跳转网页</el-radio>
                      <el-radio label="miniprogram" size="large">跳转小程序</el-radio>
                    </el-radio-group>
                  </div>
                  <div v-if="menu_type === 'click'" class="custom-menu-content">
                    <div class="input-title">菜单内容</div>
                    <div class="input-box">
                      <el-form-item prop="key">
                        <el-input v-model="formData.key" placeholder="功能key" />
                        <p class="input-tip">key值为管理平台创建好的功能key</p>
                      </el-form-item>
                    </div>
                    <div class="txt-content">
                      <div class="msg-container" />
                    </div>
                  </div>
                  <div v-if="menu_type === 'view'" class="custom-menu-content">
                    <div class="input-title">网页链接</div>
                    <div class="url-content">
                      <div class="input-box">
                        <el-form-item prop="url">
                          <el-input v-model="formData.url" placeholder="公众号链接" />
                          <p class="input-tip">跳转连接推荐使用安全域名https://</p>
                        </el-form-item>
                      </div>
                    </div>
                  </div>
                  <div v-if="menu_type === 'miniprogram'" class="custom-menu-content">
                    <div class="input-title">小程序</div>
                    <div class="input-box">
                      <el-form-item prop="appid">
                        <el-input v-model="formData.appid" placeholder="小程序Appid" />
                        <p class="input-tip">输入对应的小程序Appid 示例：wxd027d2b162044fd5</p>
                      </el-form-item>
                      <el-form-item prop="pagepath">
                        <el-input v-model="formData.pagepath" placeholder="页面路径" />
                        <p class="input-tip">示例/pages/index/index</p>
                      </el-form-item>
                    </div>
                  </div>
                </el-form>
                <div class="custom-menu-delete">
                  <div class="input-title">
                    <div class="delete-btn">删除菜单</div>
                  </div>
                </div>
              </div>
              <!--              有二级菜单-->
              <div v-if="isHaveSubMenu() === true && select_menu_id !== 0 && select_menu_sub_id === 0" class="custom-have-menu-box">
                <h3>菜单信息</h3>
                <el-form ref="formVisible" :model="formData" :rules="rule">
                  <div class="custom-menu-name">
                    <div class="input-title">名称</div>
                    <div class="input-box">
                      <el-form-item prop="name">
                        <el-input v-model="formData.name" placeholder="仅支持中文或数字" />
                        <p class="input-tip">仅支持中英文和数字，字数不超过4个汉字或8个字母。</p>
                      </el-form-item>
                    </div>
                  </div>
                  <div class="custom-menu-delete">
                    <div class="input-title">
                      <el-button link type="danger" class="delete-btn">删除菜单</el-button>
                    </div>
                  </div>
                </el-form>
              </div>
            </div>
            <!--            没有菜单-->
            <div v-if="menu_data.button.length === 0" class="attribute-box">
              <el-empty description="你未添加自定义菜单，点击左侧添加菜单为公众号创建菜单栏。" />
            </div>
            <!--            右侧底部按钮组-->
            <div class="menu__edit-action-bar">
              <div class="menu__edit-action-inner">
                <div class="menu__edit-button">
                  <el-button type="default" class="preview-btn" @click="preview">预览</el-button>
                  <el-button type="primary" class="save-btn" @click="saveMenu">保存</el-button>
                  <el-button type="primary" class="publish-btn" @click="submitMenuData">保存并发布</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const select_menu_id = ref(0)
const select_menu_sub_id = ref(0)
const menu_type = ref('')
// 表单数据
const formData = ref({})
const rule = ref({
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { min: 2, message: '请输入菜单名称 最低5位字符', trigger: 'blur' },
    { max: 4, message: '请输入菜单名称 最多4位字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入网页链接', trigger: 'blur' },
    { pattern: /^(http|https):\/\//, message: '请输入正确的网页链接', trigger: 'blur' }
  ],
  appid: [
    { required: true, message: '请输入小程序Appid', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{18}$/, message: '请输入正确的小程序Appid', trigger: 'blur' }
  ],
  pagepath: [
    { required: true, message: '请输入页面路径', trigger: 'blur' },
    // 是否是小程序页面路径
    { pattern: /^pages\/.+/, message: '请输入正确的页面路径', trigger: 'blur' }
  ],
  key: [
    { required: true, message: '请输入菜单内容', trigger: 'blur' }
  ]
})


const menu_data = ref({
  button: [],
  matchrule: {
    tag_id: '2',
    sex: '1',
    country: '中国',
    province: '广东',
    city: '广州',
    // client_platform_type: '2',
    language: 'zh_CN'
  }
})

// 保存菜单数据
const saveMenu = async() => {
  // 如果没有选择菜单，不保存
  if (select_menu_id.value === 0) {
    return
  }
  // 找到对应的菜单
  const menu = menu_data.value.button.find(item => item.id === select_menu_id.value)
  // 如果没有选择二级菜单
  if (select_menu_sub_id.value === 0) {
    // 如果没有二级菜单，修改完整的一级菜单 如果有二级菜单，修改一级菜单的name
    if (menu.sub_button.length === 0) {
      menu.name = formData.value.name
      menu.type = menu_type.value
      switch (menu_type.value) {
        case 'click':
          menu.key = formData.value.key
          // 把当前一级菜单除了name、sub_button、id、type、key字段外 删除一级菜单的其他字段
          const { name, sub_button, id, type, key } = menu
          menu_data.value.button.splice(menu_data.value.button.findIndex(item => item.id === select_menu_id.value), 1, {
            name,
            sub_button,
            id,
            type,
            key
          })
          break
        case 'view':
          menu.url = formData.value.url
          // 把当前一级菜单除了name、sub_button、id、type、url字段外 删除一级菜单的其他字段
          const { name: name1, sub_button: sub_button1, id: id1, type: type1, url } = menu
          menu_data.value.button.splice(menu_data.value.button.findIndex(item => item.id === select_menu_id.value), 1, {
            name: name1,
            sub_button: sub_button1,
            id: id1,
            type: type1,
            url
          })
          break
        case 'miniprogram':
          menu.appid = formData.value.appid
          menu.pagepath = formData.value.pagepath
          // 把当前一级菜单除了name、sub_button、id、type、appid、pagepath字段外 删除一级菜单的其他字段
          const { name: name2, sub_button: sub_button2, id: id2, type: type2, appid, pagepath } = menu
          menu_data.value.button.splice(menu_data.value.button.findIndex(item => item.id === select_menu_id.value), 1, {
            name: name2,
            sub_button: sub_button2,
            id: id2,
            type: type2,
            appid,
            pagepath
          })
          break
      }
    } else {
      menu.name = formData.value.name
    }
  } else {
    const sub_menu = menu.sub_button.find(item => item.id === select_menu_sub_id.value)
    sub_menu.name = formData.value.name
    sub_menu.type = menu_type.value
    switch (menu_type.value) {
      case 'click':
        sub_menu.key = formData.value.key
        // 把当前二级菜单除了name、id、type、key字段外 删除一级菜单的其他字段
        const { name, id, type, key } = sub_menu
        menu.sub_button.splice(menu.sub_button.findIndex(item => item.id === select_menu_sub_id.value), 1, {
          name,
          id,
          type,
          key
        })
        break
      case 'view':
        sub_menu.url = formData.value.url
        // 把当前二级菜单除了name、id、type、url字段外 删除一级菜单的其他字段
        const { name: name1, id: id1, type: type1, url } = sub_menu
        menu.sub_button.splice(menu.sub_button.findIndex(item => item.id === select_menu_sub_id.value), 1, {
          name: name1,
          id: id1,
          type: type1,
          url
        })
        break
      case 'miniprogram':
        sub_menu.appid = formData.value.appid
        sub_menu.pagepath = formData.value.pagepath
        // 把当前二级菜单除了name、id、type、appid、pagepath字段外 删除一级菜单的其他字段
        const { name: name2, id: id2, type: type2, appid, pagepath } = sub_menu
        menu.sub_button.splice(menu.sub_button.findIndex(item => item.id === select_menu_sub_id.value), 1, {
          name: name2,
          id: id2,
          type: type2,
          appid,
          pagepath
        })
        break
    }
  }
}

// 提交菜单数据
const emits = defineEmits(['myCustomEvent'])
const submitMenuData = async () => {
  await saveMenu()
  emits('submitMenuData', menu_data.value)
}

// 预览
const preview = () => {
  ElMessageBox.alert('开源版不支持预览\n如有需要专业版本请联系作者', '提醒', {
    // if you want to disable its autofocus
    center: true,
    type: 'warning',
    confirmButtonText: 'OK',
  })
}

// 是否包含二级菜单
const isHaveSubMenu = () => {
  if (menu_data.value.button.length > 0) {
    const menu_id = select_menu_id.value
    const menu = menu_data.value.button.find(item => item.id === menu_id)
    // 如果存在二级菜单
    if (menu.sub_button && menu.sub_button.length > 0) {
      return true
    } else {
      return false
    }
  }
}

// 添加一级菜单
const addMainMenu = async() => {
  formData.value = {}
  if (menu_data.value.button.length < 3) {
    let menu_id = 0
    if (menu_data.value.button.length === 0) {
      menu_id = 1
    } else {
      menu_id = menu_data.value.button[menu_data.value.button.length - 1].id + 1
    }
    menu_data.value.button.push({
      id: menu_id,
      name: '菜单名称',
      type: 'click',
      key: '',
      sub_button: []
    })
    // 如果新增菜单将菜单id设置为新增菜单的id
    select_menu_id.value = menu_id
    await selectMenu(select_menu_id.value)
  } else {
    console.log('最多只能添加三个一级菜单')
  }
}

// 添加二级菜单
const addMSubMenu = async() => {
  formData.value = {}
  const menu_id = select_menu_id.value
  const menu = menu_data.value.button.find(item => item.id === menu_id)
  // 如果二级菜单小于5个
  if (menu.sub_button.length < 5) {
    let sub_menu_id = 0
    if (menu.sub_button.length === 0) { // 如果没有二级菜单，设置id为1
      sub_menu_id = 1
    } else { // 如果有二级菜单，设置id为最后一个二级菜单的id+1
      sub_menu_id = menu.sub_button[menu.sub_button.length - 1].id + 1
    }
    menu.sub_button.push({ // 添加二级菜单
      id: menu.sub_button.length + 1,
      name: '子菜单名称',
      type: 'click',
      key: '',
    })
    select_menu_sub_id.value = sub_menu_id // 将选中二级菜单id设置为新增二级菜单的id
    await selectSubMenu(select_menu_sub_id.value)
    // 把当前一级菜单除了name和sub_button和id字段外 删除一级菜单的其他字段
    const { name, sub_button, id } = menu
    menu_data.value.button.splice(menu_data.value.button.findIndex(item => item.id === menu_id), 1, {
      name,
      sub_button,
      id
    })
  } else {
    console.log('最多只能添加五个二级菜单')
  }
}

// 选择菜单
const selectMenu = async(item) => {
  formData.value = {}
  select_menu_id.value = item
  select_menu_sub_id.value = 0
  const menu = menu_data.value.button.find(item => item.id === select_menu_id.value)
  // 如果没有二级菜单，将form表单的数据设置为一级菜单的数据
  if (menu_data.value.button.find(item => item.id === select_menu_id.value).sub_button.length === 0) {
    formData.value.name = menu.name
    menu_type.value = menu.type
    switch (menu_type.value) {
      case 'click':
        formData.value.key = menu.key
        break
      case 'view':
        formData.value.url = menu.url
        break
      case 'miniprogram':
        formData.value.appid = menu.appid
        formData.value.pagepath = menu.pagepath
        break
    }
  } else {
    formData.value.name = menu.name
  }
}

// 选择二级菜单
const selectSubMenu = async(item) => {
  formData.value = {}
  select_menu_sub_id.value = item
  const menu = menu_data.value.button.find(item => item.id === select_menu_id.value)
  const sub_menu = menu.sub_button.find(item => item.id === select_menu_sub_id.value)
  formData.value.name = sub_menu.name
  switch (sub_menu.type) {
    case 'click':
      menu_type.value = 'click'
      formData.value.key = sub_menu.key
      break
    case 'view':
      menu_type.value = 'view'
      formData.value.url = sub_menu.url
      break
    case 'miniprogram':
      menu_type.value = 'miniprogram'
      formData.value.appid = sub_menu.appid
      formData.value.pagepath = sub_menu.pagepath
      break
  }
}

// 往左移动选择菜单
const onLeftMove = async() => {
  let previousId = null
  for (let i = 0; i < menu_data.value.button.length; i++) {
    if (menu_data.value.button[i].id === select_menu_id.value) {
      if (i > 0) {
        previousId = menu_data.value.button[i - 1].id
      }
      break // 找到目标后可以提前退出循环
    }
  }
  await selectMenu(previousId)
}

// 删除对应id的菜单
const onDelete = async() => {
  const menu_id = select_menu_id.value
  for (let i = 0; i < menu_data.value.button.length; i++) {
    if (menu_data.value.button[i].id === menu_id) {
      menu_data.value.button.splice(i, 1)
      break // 可以提高性能，因为一旦找到要删除的对象就不需要再继续循环
    }
  }
}

const onDeleteSub = async() => {
  const menu_id = select_menu_id.value
  const sub_menu_id = select_menu_sub_id.value
  for (let i = 0; i < menu_data.value.button.length; i++) {
    if (menu_data.value.button[i].id === menu_id) {
      for (let j = 0; j < menu_data.value.button[i].sub_button.length; j++) {
        if (menu_data.value.button[i].sub_button[j].id === sub_menu_id) {
          menu_data.value.button[i].sub_button.splice(j, 1)

          // 如果删除的是最后一个二级菜单，将一级菜单的id设置为选中
          if (menu_data.value.button[i].sub_button.length === 0) {
            select_menu_id.value = menu_id
            await selectMenu(select_menu_id.value)
          } else {
            // 如果删除的不是最后一个二级菜单，将剩余最后一个 或者前一个二级菜单设置为选中
            if (j === menu_data.value.button[i].sub_button.length) {
              select_menu_sub_id.value = menu_data.value.button[i].sub_button[j - 1].id
              await selectSubMenu(select_menu_sub_id.value)
            } else {
              select_menu_sub_id.value = menu_data.value.button[i].sub_button[j].id
              await selectSubMenu(select_menu_sub_id.value)
            }
          }

          break // 可以提高性能，因为一旦找到要删除的对象就不需要再继续循环
        }
      }
    }
  }
}

// 往右移动选择菜单
const onRightMove = async() => {
  let nextId = null

  for (let i = 0; i < menu_data.value.button.length; i++) {
    if (menu_data.value.button[i].id === select_menu_id.value) {
      if (i < menu_data.value.button.length - 1) {
        nextId = menu_data.value.button[i + 1].id
      }
      break // 找到目标后可以提前退出循环
    }
  }
  await selectMenu(nextId)
}
</script>

<style scoped lang="scss">
@import "@/style/wechat-menu";
</style>
