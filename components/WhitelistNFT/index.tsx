import * as React from 'react';
import Tinlake from 'tinlake';
import { Box, FormField, TextInput, Button, Heading, Text } from 'grommet';
import Alert from '../Alert';
import Link from 'next/link';
import SecondaryHeader from '../SecondaryHeader';
import { LinkPrevious } from 'grommet-icons';
import { NumberInput } from '@centrifuge/axis-number-input';
import { baseToDisplay } from '../../utils/baseToDisplay';
import { displayToBase } from '../../utils/displayToBase';

const SUCCESS_STATUS = '0x1';

interface Props {
  tinlake: Tinlake;
  tokenId: string;
}

interface State {
  tokenId: string;
  principal: string;
  appraisal: string;
  is: 'loading' | 'success' | 'error' | null;
  errorMsg: string;
}

class WhitelistNFT extends React.Component<Props, State> {
  state: State = {
    tokenId: '',
    principal: '100000000000000000000',
    appraisal: '300000000000000000000',
    is: null,
    errorMsg: '',
  };

  componentWillMount() {
    this.setState({ tokenId: this.props.tokenId || '' });
  }

  whitelist = async () => {
    this.setState({ is: 'loading' });

    const { tinlake } = this.props;
    const { tokenId, principal, appraisal } = this.state;
    const addresses = tinlake.contractAddresses;

    try {
      // admit
      const nftOwner = await tinlake.ownerOfNFT(tokenId);

      console.log(`NFT owner of tokenId ${tokenId} is ${nftOwner}`);

      const res2 = await tinlake.adminAdmit(addresses['NFT_COLLATERAL'], tokenId, principal,
                                            nftOwner);

      console.log('admit result');
      console.log(res2.txHash);

      if (res2.status !== SUCCESS_STATUS || res2.events[0].event.name !== 'Transfer') {
        console.log(res2);
        this.setState({ is: 'error', errorMsg: JSON.stringify(res2) });
        return;
      }

      const loanId = res2.events[0].data[2].toString();
      console.log(`Loan id: ${loanId}`);

      // appraise
      const res3 = await tinlake.adminAppraise(loanId, appraisal);

      console.log('appraisal results');
      console.log(res3.txHash);

      if (res3.status !== SUCCESS_STATUS) {
        console.log(res3);
        this.setState({ is: 'error', errorMsg: JSON.stringify(res3) });
        return;
      }

      this.setState({ is: 'success' });
    } catch (e) {
      console.log(e);
      this.setState({ is: 'error', errorMsg: e.message });
    }
  }

  render() {
    const { tokenId, principal, appraisal, is, errorMsg } = this.state;

    return <Box>
      <SecondaryHeader>
        <Box direction="row" gap="small" align="center">
          <Link href="/admin">
            <LinkPrevious />
          </Link>
          <Heading level="3">Whitelist NFT</Heading>
        </Box>

        <Button onClick={this.whitelist} primary label="Whitelist"
          disabled={is === 'loading' || is === 'success'} />
      </SecondaryHeader>

      <Box pad={{ horizontal: 'medium' }}>
        {is === 'loading' && 'Whitelisting...'}
        {is === 'success' && <Alert type="success">
          Successfully whitelisted NFT for Token ID {tokenId}</Alert>}
        {is === 'error' && <Alert type="error">
          <Text weight="bold">
            Error whitelisting NFT for Token ID {tokenId}, see console for details</Text>
          {errorMsg && <div><br />{errorMsg}</div>}
        </Alert>}

        <Box direction="row" gap="medium" margin={{ vertical: 'large' }}>
          <Box basis={'1/4'} gap="medium">
            <FormField label="NFT ID">
              <TextInput
                value={tokenId}
                onChange={e => this.setState({ tokenId: e.currentTarget.value })}
                disabled={is === 'loading' || is === 'success'}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'} gap="medium">
            <FormField label="Appraisal">
              <NumberInput
                value={baseToDisplay(appraisal, 18)} suffix=" DAI" precision={18} autoFocus
                onChange={(masked: string, float: number) => float !== undefined &&
                  this.setState({ appraisal: displayToBase(masked, 18) })}
                disabled={is === 'loading' || is === 'success'}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'} gap="medium">
            <FormField label="Principal">
              <NumberInput
                value={baseToDisplay(principal, 18)} suffix=" DAI" precision={18}
                onChange={(masked: string, float: number) => float !== undefined &&
                  this.setState({ principal: displayToBase(masked, 18) })}
                disabled={is === 'loading' || is === 'success'}
              />
            </FormField>
          </Box>
          <Box basis={'1/4'} gap="medium" />
        </Box>
      </Box>
    </Box>;
  }
}

export default WhitelistNFT;
