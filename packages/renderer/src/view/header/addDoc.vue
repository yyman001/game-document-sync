<template>
  <div>
    <FileAddOutlined :style="{ fontSize: '24px', color: '#08c' }" @click="onModalOpen"/>
    <a-modal title="添加游戏存档信息目录" :visible="isVisible" :footer="null" :maskClosable="false" @cancel="onModalClose">
      <a-form class="doc-form" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <a-form-item label="SteamId" name="steamId">
          <a-input v-model:value="steamId" />
        </a-form-item>

        <a-form-item label="游戏名" name="gameName">
          <a-input v-model:value="gameName" @change="onChangeSearchGameName" />
          <a-alert v-if="repetitionGame.length" type="error"
            :message="'重复游戏:' + repetitionGame[0].gameName || repetitionGame[0].nickName" banner />
        </a-form-item>

        <a-form-item label="游戏别名" name="nickName">
          <a-input v-model:value="nickName" />
        </a-form-item>

        <a-form-item label="文件夹存档名" name="gameDocDir">
          <a-input v-model:value="gameDocDir" />
        </a-form-item>

        <a-form-item label="存档路径" name="gameDocFullPath">
          <a-input v-model:value="gameDocFullPath" />
        </a-form-item>

        <a-form-item label="存档路径类型" name="pathType">
          <a-input :value="pathType" disabled />
        </a-form-item>

        <a-form-item label="存档相对路径" name="gameDocPath">
          <a-input :value="gameDocPath" disabled />
        </a-form-item>

        <a-form-item label="系统类型" name="systemType">
          <a-input :value="SYSTEM_TYPE" disabled />
        </a-form-item>

        <a-form-item label="用户目录" name="homedir">
          <a-input :value="HOME_DIR" disabled />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit" @click="onSubmit"> {{ isUpdate ? '更新' : '添加' }} </a-button>
          <a-button html-type="submit" @click="onModalClose">取消</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref } from 'vue'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { FileAddOutlined } from '@ant-design/icons-vue'

import useSystem from '@/hooks/core/useSystem'
import useDocs from '@/hooks/db/useDocs'
import { useDocFormStoreWhitOut } from '@/store/doc'

const { success: messageSuccess, error: messageError } = message
const docFrom = useDocFormStoreWhitOut()
const {
  isUpdate,
  isVisible,
  pathType,
  steamId,
  gameName,
  nickName,
  gameDocDir,
  gameDocPath,
  gameDocFullPath
} = storeToRefs(docFrom)

const { HOME_DIR, SYSTEM_TYPE } = useSystem()
const { onAddDoc, hasGameDoc, onUpdateDoc } = useDocs()
const repetitionGame = ref<any[]>([])

const onSubmit = async () => {
  const item = {
    steamId: unref(steamId),
    gameName: unref(gameName),
    nickName: unref(nickName),
    gameDocDir: unref(gameDocDir),
    gameDocPath: unref(gameDocPath),
    systemType: SYSTEM_TYPE,
    pathType: unref(pathType),
    saveGameDataLocationForWindows: /windows/ig.test(SYSTEM_TYPE) ? `%${unref(pathType)}%${unref(gameDocPath)}` : ''
  }

  console.log('sub data:', item)
  try {
    if (isUpdate) {
      await onUpdateDoc(item)
    } else {
      await onAddDoc(item)
    }
    docFrom.onCloseDocModal()
    messageSuccess(`${isUpdate ? '更新' : '创建'}游戏文档成功!`)
  } catch (e) {
    console.error(e)
  }
  messageError('操作失败!')
}

const onChangeSearchGameName = async (e: Event) => {
  if (isUpdate || !unref(gameName)) return
  const rtx = await hasGameDoc(unref(gameName))
  repetitionGame.value = rtx
  console.log('onChangeSearchGameName:', unref(gameName), rtx)
}

const onModalOpen = () => docFrom.onModalOpen()
const onModalClose = () => docFrom.onCloseDocModal()

</script>

<style>
.doc-form .ant-form-item{
  margin-bottom: 14px;
}
</style>
