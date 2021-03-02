// © Microsoft Corporation. All rights reserved.

import { CommunicationUserToken, TokenScope } from '@azure/communication-identity';
import * as express from 'express';
import { createUserWithToken } from '../lib/identityClient';

const router = express.Router();

/**
 * handleUserTokenRequest will return a default scoped token if no scopes are provided.
 * @param requestedScope [optional] string from the request, this should be a comma seperated list of scopes.
 */
const handleUserTokenRequest = async (requestedScope?: string): Promise<CommunicationUserToken> => {
  const scopes: TokenScope[] = requestedScope ? (requestedScope.split(',') as TokenScope[]) : ['chat', 'voip'];
  return await createUserWithToken(scopes);
};

/**
 * By default the get and post routes will return a token with scopes ['chat', 'voip'].
 * Optionally ?scope can be passed in containing scopes seperated by comma
 * e.g. ?scope=chat,voip
 */
router.get('/', async (req, res, next) => res.send(await handleUserTokenRequest((req.query.scope as string) ?? '')));
router.post('/', async (req, res, next) => res.send(await handleUserTokenRequest((req.body.scope as string) ?? '')));

export default router;
