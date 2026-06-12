import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ChatInput from '~/components/global/ChatInput.vue'
import Button from '~/components/global/Button.vue'

const global = { components: { Button } }

describe('ChatInput', () => {
  it('renderiza el placeholder en el textarea', () => {
    const wrapper = mount(ChatInput, {
      props: { modelValue: '', placeholder: 'Escribí algo...' },
      global,
    })
    expect(wrapper.find('textarea').attributes('placeholder')).toBe('Escribí algo...')
  })

  it('el textarea refleja el modelValue recibido', () => {
    const wrapper = mount(ChatInput, {
      props: { modelValue: 'hola mundo', placeholder: '' },
      global,
    })
    expect(wrapper.find('textarea').element.value).toBe('hola mundo')
  })

  it('emite update:modelValue al escribir en el textarea', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '' }, global })
    await wrapper.find('textarea').setValue('nuevo texto')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['nuevo texto'])
  })

  it('emite send al presionar Enter sin Shift', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'mensaje' }, global })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: false })
    expect(wrapper.emitted('send')).toBeTruthy()
  })

  it('no emite send al presionar Shift+Enter', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'mensaje' }, global })
    await wrapper.find('textarea').trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('send')).toBeFalsy()
  })

  it('el botón está deshabilitado cuando modelValue es vacío', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '' }, global })
    expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
  })

  it('el botón está deshabilitado cuando modelValue es solo espacios', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '   ' }, global })
    expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
  })

  it('el botón está deshabilitado cuando disabled es true', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'texto', disabled: true }, global })
    expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
  })

  it('el botón no está deshabilitado cuando hay texto y disabled es false', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'texto', disabled: false }, global })
    expect(wrapper.findComponent(Button).props('disabled')).toBe(false)
  })

  it('emite send al hacer clic en el botón', async () => {
    const wrapper = mount(ChatInput, { props: { modelValue: 'mensaje', disabled: false }, global })
    await wrapper.findComponent(Button).trigger('click')
    expect(wrapper.emitted('send')).toBeTruthy()
  })

  it('muestra el hint de teclado', () => {
    const wrapper = mount(ChatInput, { props: { modelValue: '' }, global })
    expect(wrapper.text()).toContain('Enter para enviar')
  })
})
