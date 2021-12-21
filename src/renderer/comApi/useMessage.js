import Message from 'ant-design-vue/lib/message'

export default function () {
  const messageSuccess = (content, duration, onClose) => { Message.success(content, duration, onClose) }
  const messageError = (content, duration, onClose) => { Message.error(content, duration, onClose) }
  const messageWarn = (content, duration, onClose) => { Message.warn(content, duration, onClose) }

  const message = (isTrue, content, duration, onClose) => {
    isTrue ? messageSuccess(content, duration, onClose) : messageError(content, duration, onClose)
  }

  return {
    message,
    messageSuccess,
    messageError,
    messageWarn
  }
}
