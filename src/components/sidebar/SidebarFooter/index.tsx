import type { ReactElement } from 'react'
import { useEffect } from 'react'

import {
  SidebarList,
  SidebarListItemButton,
  SidebarListItemIcon,
  SidebarListItemText,
} from '@/components/sidebar/SidebarList'
import { loadBeamer } from '@/services/beamer'
import { useAppDispatch, useAppSelector } from '@/store'
import { CookieAndTermType, hasConsentFor } from '@/store/cookiesAndTermsSlice'
import { openCookieBanner } from '@/store/popupSlice'
// import BeamerIcon from '@/public/images/sidebar/whats-new.svg'
import HelpCenterIcon from '@/public/images/sidebar/help-center.svg'
import { ListItem, SvgIcon, Typography } from '@mui/material'
import DebugToggle from '../DebugToggle'
import { HELP_CENTER_URL, IS_PRODUCTION } from '@/config/constants'
import { useCurrentChain } from '@/hooks/useChains'
import ProtofireLogo from '@/public/images/protofire-logo.svg'
import SuggestionIcon from '@/public/images/sidebar/lightbulb_icon.svg'
import ExternalLink from '@/components/common/ExternalLink'

export const NEW_SUGGESTION_FORM =
  'https://docs.google.com/forms/d/e/1FAIpQLSfojsADYCiWq9AqbLqsUTzCDSpA8FMgdAQp0Pyl0BOeurlq9A/viewform'

const SidebarFooter = (): ReactElement => {
  const dispatch = useAppDispatch()
  const chain = useCurrentChain()
  const hasBeamerConsent = useAppSelector((state) => hasConsentFor(state, CookieAndTermType.UPDATES))

  useEffect(() => {
    // Initialise Beamer when consent was previously given
    if (hasBeamerConsent && chain?.shortName) {
      loadBeamer(chain.shortName)
    }
  }, [hasBeamerConsent, chain?.shortName])

  const handleBeamer = () => {
    if (!hasBeamerConsent) {
      dispatch(openCookieBanner({ warningKey: CookieAndTermType.UPDATES }))
    }
  }

  return (
    <SidebarList>
      {!IS_PRODUCTION && (
        <ListItem disablePadding>
          <DebugToggle />
        </ListItem>
      )}

      <ListItem disablePadding>
        <a target="_blank" rel="noopener noreferrer" href={HELP_CENTER_URL} style={{ width: '100%' }}>
          <SidebarListItemButton>
            <SidebarListItemIcon color="primary">
              <HelpCenterIcon />
            </SidebarListItemIcon>
            <SidebarListItemText data-testid="list-item-need-help" bold>
              Need help?
            </SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>
      <ListItem disablePadding>
        <a target="_blank" rel="noopener noreferrer" href={NEW_SUGGESTION_FORM} style={{ width: '100%' }}>
          <SidebarListItemButton style={{ backgroundColor: '#5FDDFF', color: 'black' }}>
            <SidebarListItemIcon color="primary">
              <SuggestionIcon />
            </SidebarListItemIcon>
            <SidebarListItemText bold>New Features Suggestion?</SidebarListItemText>
          </SidebarListItemButton>
        </a>
      </ListItem>
      <SidebarListItemText sx={{ marginLeft: 2 }}>
        <Typography variant="caption">
          Supported by{' '}
          <SvgIcon
            component={ProtofireLogo}
            inheritViewBox
            fontSize="small"
            sx={{ verticalAlign: 'middle', mx: 0.5 }}
          />
          <ExternalLink href="https://protofire.io" sx={{ textDecoration: 'none' }} noIcon>
            Protofire
          </ExternalLink>
        </Typography>
      </SidebarListItemText>
    </SidebarList>
  )
}

export default SidebarFooter
