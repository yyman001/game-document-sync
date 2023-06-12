<template>
  <div>
    <FileAddOutlined :style="{ fontSize: '24px', color: '#08c' }" @click="onModalOpen"/>

    <a-modal title="添加游戏存档信息目录" :visible="isVisible" :footer="null" :maskClosable="false" @cancel="onModalClose">
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
        @finish="onFinish" @finishFailed="onFinishFailed">
        <a-form-item label="SteamId" name="steamId">
          <a-input v-model:value="formState.steamId" />
        </a-form-item>

        <a-form-item label="游戏名" name="gameName">
          <a-input v-model:value="formState.gameName" @change="onChangeSearchGameName" />
          <a-alert v-if="repetitionGame.length" type="error"
            :message="'重复游戏:' + repetitionGame[0].gameName || repetitionGame[0].nickName" banner />
        </a-form-item>

        <a-form-item label="游戏别名" name="nickName">
          <a-input v-model:value="formState.nickName" />
        </a-form-item>

        <a-form-item label="文件夹存档名" name="gameDocDir">
          <a-input v-model:value="formState.gameDocDir" />
        </a-form-item>

        <a-form-item label="存档路径" name="gameDocFullPath">
          <a-input v-model:value="formState.gameDocFullPath" />
        </a-form-item>

        <a-form-item label="存档相对路径" name="gameDocPath">
          <a-input :value="formState.gameDocPath" disabled />
        </a-form-item>

        <a-form-item label="系统类型" name="systemType">
          <a-input :value="SYSTEM_TYPE" disabled />
        </a-form-item>

        <a-form-item label="用户目录" name="homedir">
          <a-input :value="HOME_DIR" disabled />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">添加</a-button>
          <a-button html-type="submit" @click="onModalClose">取消</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue'
import { FileAddOutlined } from '@ant-design/icons-vue'

import useModal from '@/hooks/useModal'
import useSystem from '@/hooks/core/useSystem'
import useDocs from '@/hooks/db/useDocs'
import path from 'path'

export default defineComponent({
  components: { FileAddOutlined },
  setup () {
    const { HOME_DIR, SYSTEM_TYPE } = useSystem()
    const { isVisible, onModalOpen, onModalClose } = useModal()
    const { onAddDoc, hasGameDoc } = useDocs()
    const repetitionGame = ref<any[]>([])
    const DOC_TYPE = {
      '%APPDATA%': '\\AppData\\Roaming',
      '%LOCALAPPDATA%': '\\AppData\\Local',
      '%USERPROFILE%': '\\AppData\\LocalLow'
    }

    const formState = reactive({
      steamId: '',
      gameName: '',
      nickName: '',
      gameDocDir: '',
      gameDocPath: '',
      gameDocFullPath: ''
    })

    const resetFormState = () => {
      formState.steamId = ''
      formState.gameName = ''
      formState.nickName = ''
      formState.gameDocDir = ''
      formState.gameDocPath = ''
      formState.gameDocFullPath = ''
    }

    const onFinish = async () => {
      console.log('formState:', formState)
      const { steamId, gameName, nickName, gameDocDir, gameDocPath } = formState
      try {
        await onAddDoc({
          gameDocPath,
          gameName,
          nickName,
          steamId,
          systemType: SYSTEM_TYPE,
          gameDocDir
        })
        onModalClose()
        resetFormState()
      } catch (e) {
        console.error(e)
      }
    }

    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo)
    }

    watch(
      () => formState.gameDocFullPath,
      value => {
        if (/%USERPROFILE%/.test(value)) {
          value = value.replace(/%USERPROFILE%/g, '')
        }
        const pathObject = path.parse(value)
        console.log('pathObject:', pathObject)
        // 有时候, 游戏名不等于 文件夹名, 如 Keplerth: Another World => Keplerth
        switch (pathObject.dir) {
          case '%APPDATA%':
          case '%LOCALAPPDATA%':
            formState.gameDocPath = path.join(DOC_TYPE[pathObject.dir], pathObject.name)
            formState.gameDocDir = pathObject.name
            formState.gameName = pathObject.name.replace(/_/gi, ' ')
            break
          default:
            // 表达式: \w+:\\users\\\w+?\\ 替换 C:\Users\???\
            formState.gameDocPath = pathObject.dir.replace(/\w+:\\users\\\w+?\\/gi, '\\')
            formState.gameDocDir = pathObject.name
            formState.gameName = pathObject.name.replace(/_/gi, ' ')
            break
        }
      }
    )

    const onChangeSearchGameName = async (e: Event) => {
      if (!formState.gameName) return
      const rtx = await hasGameDoc(formState.gameName)
      repetitionGame.value = rtx
      console.log('onChangeSearchGameName:', formState.gameName, rtx)
    }

    return {
      isVisible,
      onModalOpen,
      onModalClose,

      repetitionGame,
      formState,
      onFinish,
      onFinishFailed,
      onChangeSearchGameName,

      HOME_DIR,
      SYSTEM_TYPE
    }
  }
})
</script>

<style></style>
