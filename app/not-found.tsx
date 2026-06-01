import {routing} from '@/localization/routing'
import {redirect} from 'next/navigation'

export default function RootNotFound() {
    redirect(`/${routing.defaultLocale}`)
}
