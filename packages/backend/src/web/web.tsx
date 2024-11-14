import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/app'
import './css/tailwind.css'

localStorage['debug'] = '*'

var app容器 = document.getElementById('app')
if (!app容器) throw new Error('没有找到容器')

const root = createRoot(app容器)
root.render(
  <StrictMode>
    <App></App>
  </StrictMode>,
)
