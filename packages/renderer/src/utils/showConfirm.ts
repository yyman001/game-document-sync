import { Modal } from 'ant-design-vue'
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title,
      content,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        resolve(true) // 用户点击了确认按钮
      },
      onCancel() {
        resolve(false) // 用户点击了取消按钮或者点击遮罩层关闭
      },
      afterClose() {
        reject(new Error('Modal关闭')) // 处理异常情况
      }
    })
  })
}
