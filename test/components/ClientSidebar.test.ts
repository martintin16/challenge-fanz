import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ClientSidebar from '~/components/global/ClientSidebar.vue'
import Avatar from '~/components/global/Avatar.vue'

const global = { components: { Avatar } }

describe('ClientSidebar', () => {
  it('renderiza el título cuando se provee', () => {
    const wrapper = mount(ClientSidebar, { props: { title: 'Cuenta Mock' }, global })
    expect(wrapper.find('.sidebar-title').text()).toBe('Cuenta Mock')
  })

  it('no renderiza el título cuando no se provee', () => {
    const wrapper = mount(ClientSidebar, { props: {}, global })
    expect(wrapper.find('.sidebar-title').exists()).toBe(false)
  })

  it('renderiza el Avatar cuando name se provee', () => {
    const wrapper = mount(ClientSidebar, { props: { name: 'Martin Iglesias' }, global })
    expect(wrapper.findComponent(Avatar).exists()).toBe(true)
  })

  it('pasa el name al Avatar correctamente', () => {
    const wrapper = mount(ClientSidebar, { props: { name: 'Martin Iglesias' }, global })
    expect(wrapper.findComponent(Avatar).props('name')).toBe('Martin Iglesias')
  })

  it('no renderiza el Avatar cuando name no se provee', () => {
    const wrapper = mount(ClientSidebar, { props: {}, global })
    expect(wrapper.findComponent(Avatar).exists()).toBe(false)
  })

  it('renderiza el nombre en el sidebar', () => {
    const wrapper = mount(ClientSidebar, { props: { name: 'Martin Iglesias' }, global })
    expect(wrapper.find('.sidebar-avatar_name').text()).toBe('Martin Iglesias')
  })

  it('renderiza el footerText cuando se provee', () => {
    const wrapper = mount(ClientSidebar, { props: { footerText: 'Powered by Fanz' }, global })
    expect(wrapper.find('.sidebar-footer_text').text()).toBe('Powered by Fanz')
  })

  it('no renderiza el footer cuando footerText no se provee', () => {
    const wrapper = mount(ClientSidebar, { props: {}, global })
    expect(wrapper.find('.sidebar-footer_text').exists()).toBe(false)
  })

  it('renderiza el contenido del slot', () => {
    const wrapper = mount(ClientSidebar, {
      props: {},
      global,
      slots: { default: '<p class="slot-content">Métricas</p>' },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
    expect(wrapper.text()).toContain('Métricas')
  })
})
