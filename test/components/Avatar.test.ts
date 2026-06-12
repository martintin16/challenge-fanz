import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Avatar from '~/components/global/Avatar.vue'

describe('Avatar', () => {
  it('muestra la inicial de la primera y última palabra', () => {
    const wrapper = mount(Avatar, { props: { name: 'Martin Iglesias' } })
    expect(wrapper.text()).toBe('MI')
  })

  it('muestra solo la inicial cuando hay una sola palabra', () => {
    const wrapper = mount(Avatar, { props: { name: 'Martin' } })
    expect(wrapper.text()).toBe('M')
  })

  it('toma la primera y última palabra cuando hay más de dos', () => {
    const wrapper = mount(Avatar, { props: { name: 'Juan Pablo Rodriguez' } })
    expect(wrapper.text()).toBe('JR')
  })

  it('retorna vacío con nombre vacío', () => {
    const wrapper = mount(Avatar, { props: { name: '' } })
    expect(wrapper.text()).toBe('')
  })

  it('retorna vacío con solo espacios', () => {
    const wrapper = mount(Avatar, { props: { name: '   ' } })
    expect(wrapper.text()).toBe('')
  })

  it('convierte las iniciales a mayúsculas', () => {
    const wrapper = mount(Avatar, { props: { name: 'martin iglesias' } })
    expect(wrapper.text()).toBe('MI')
  })
})
