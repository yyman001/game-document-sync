<template>
  <div>
    <a-button @click="onModalOpen">添加</a-button>

    <a-modal
      title="添加游戏存档信息目录"
      :visible="isVisible"
      :footer="null"
      :maskClosable="false"
      @cancel="onModalClose"
    >
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="SteamId" name="steamId">
          <a-input v-model:value="formState.steamId" />
        </a-form-item>

        <a-form-item label="游戏名" name="gameName">
          <a-input v-model:value="formState.gameName" />
        </a-form-item>

        <a-form-item label="游戏别名" name="nickName">
          <a-input v-model:value="formState.nickName" />
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
import { defineComponent, reactive, watch } from 'vue'
import useModal from '@/hooks/useModal'
import useSystem from '@/hooks/core/useSystem'
import useDocs from '@/hooks/db/useDocs'
import path from 'path'

export default defineComponent({
  setup () {
    const { HOME_DIR, SYSTEM_TYPE } = useSystem()
    const { isVisible, onModalOpen, onModalClose } = useModal()
    const { onAddDoc } = useDocs()
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

    const onFinish = async () => {
      console.log('formState:', formState)
      const { steamId, gameName, nickName, gameDocDir, gameDocPath } = formState
      await onAddDoc({
        gameDocPath,
        gameName,
        nickName,
        steamId,
        systemType: SYSTEM_TYPE,
        gameDocDir
      })
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

    return {
      isVisible,
      onModalOpen,
      onModalClose,

      formState,
      onFinish,
      onFinishFailed,

      HOME_DIR,
      SYSTEM_TYPE
    }
  }
})
</script>

<style></style>
