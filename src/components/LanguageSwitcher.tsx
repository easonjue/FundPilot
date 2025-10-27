import { GlobalOutlined } from '@ant-design/icons'
import { Dropdown, Button } from 'antd'
import type { MenuProps } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '@/stores/languageStore'

interface LanguageSwitcherProps {
  size?: 'small' | 'middle' | 'large'
  type?: 'default' | 'text' | 'link' | 'primary'
  showText?: boolean
  placement?: 'bottom' | 'bottomLeft' | 'bottomRight' | 'top' | 'topLeft' | 'topRight'
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  size = 'middle',
  type = 'text',
  showText = false,
  placement = 'bottomRight',
}) => {
  const { t: _t } = useTranslation()
  const { currentLanguage, availableLanguages, setLanguage, getNativeLanguageName } =
    useLanguageStore()

  const handleLanguageChange = (language: string) => {
    setLanguage(language as any)
  }

  const items: MenuProps['items'] = availableLanguages.map(lang => ({
    key: lang.code,
    label: (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{lang.nativeName}</span>
        {currentLanguage === lang.code && <span className="text-xs text-blue-500">✓</span>}
      </div>
    ),
    onClick: () => handleLanguageChange(lang.code),
  }))

  const currentLanguageName = getNativeLanguageName(currentLanguage)

  return (
    <Dropdown
      menu={{ items }}
      placement={placement}
      trigger={['click']}
      overlayClassName="language-switcher-dropdown"
    >
      <Button type={type} size={size} icon={<GlobalOutlined />} className="flex items-center gap-1">
        {showText && <span className="hidden sm:inline">{currentLanguageName}</span>}
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher
