import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from '~/components/global/Button.vue'

describe('Button', () => {
  it('renderiza el label', () => {
    const wrapper = mount(Button, { props: { label: 'Enviar' } })
    expect(wrapper.text()).toBe('Enviar')
  })

  it('aplica la clase "primary" por defecto', () => {
    const wrapper = mount(Button, { props: { label: 'Test' } })
    expect(wrapper.find('button').classes()).toContain('primary')
  })

  it('aplica la clase del tipo recibido', () => {
    const wrapper = mount(Button, { props: { label: 'Test', type: 'secondary' } })
    expect(wrapper.find('button').classes()).toContain('secondary')
  })

  it('aplica la clase tertiary', () => {
    const wrapper = mount(Button, { props: { label: 'Test', type: 'tertiary' } })
    expect(wrapper.find('button').classes()).toContain('tertiary')
  })

  it('deshabilita el botón cuando disabled es true', () => {
    const wrapper = mount(Button, { props: { label: 'Test', disabled: true } })
    expect(wrapper.find('button').element.disabled).toBe(true)
  })

  it('no está deshabilitado por defecto', () => {
    const wrapper = mount(Button, { props: { label: 'Test' } })
    expect(wrapper.find('button').element.disabled).toBe(false)
  })

  it('emite el evento click al hacer clic', async () => {
    const wrapper = mount(Button, { props: { label: 'Test' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('no emite click cuando está deshabilitado', async () => {
    const wrapper = mount(Button, { props: { label: 'Test', disabled: true } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
