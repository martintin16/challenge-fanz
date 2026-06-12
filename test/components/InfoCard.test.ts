import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import InfoCard from '~/components/global/InfoCard.vue'

describe('InfoCard', () => {
  it('renderiza el título cuando se provee', () => {
    const wrapper = mount(InfoCard, { props: { title: 'Festival de Verano' } })
    expect(wrapper.find('.card-title').text()).toBe('Festival de Verano')
  })

  it('renderiza el subtítulo cuando se provee', () => {
    const wrapper = mount(InfoCard, { props: { subtitle: '620/1000 · activo' } })
    expect(wrapper.find('.card-subtitle').text()).toBe('620/1000 · activo')
  })

  it('no renderiza el título cuando no se provee', () => {
    const wrapper = mount(InfoCard, { props: {} })
    expect(wrapper.find('.card-title').exists()).toBe(false)
  })

  it('no renderiza el subtítulo cuando no se provee', () => {
    const wrapper = mount(InfoCard, { props: {} })
    expect(wrapper.find('.card-subtitle').exists()).toBe(false)
  })

  it('aplica opacity-50 cuando disabled es true', () => {
    const wrapper = mount(InfoCard, { props: { disabled: true } })
    expect(wrapper.find('.card-container').classes()).toContain('opacity-50')
  })

  it('no aplica opacity-50 por defecto', () => {
    const wrapper = mount(InfoCard, { props: {} })
    expect(wrapper.find('.card-container').classes()).not.toContain('opacity-50')
  })

  it('renderiza el contenido del slot', () => {
    const wrapper = mount(InfoCard, {
      props: {},
      slots: { default: '<span class="slot-content">Contenido del slot</span>' },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Contenido del slot')
  })
})
