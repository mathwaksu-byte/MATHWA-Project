import { createPagesFunctionHandler } from '@remix-run/cloudflare'
import * as build from '../build/server/index.js'

export const onRequest = createPagesFunctionHandler({ build })
