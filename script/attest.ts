import { ethers } from 'ethers';
import * as dotenv from 'dotenv';
import readlineSync from 'readline-sync';
import axios from 'axios';
import TokenAbi from '../out/ITokenBridge.sol/ITokenBridge.json';
// console.log("🚀 ~ attest.ts:6 ~ TokenAbi:", TokenAbi)


dotenv.config();

async function main() {
  // Step 1: Get user input for source and target chains
  const sourceRpcUrl = readlineSync.question('Enter the SOURCE chain RPC URL: ');
  const sourceTokenBridgeAddress = readlineSync.question('Enter the Token Bridge contract address on the SOURCE chain: ');
  const targetRpcUrl = readlineSync.question('Enter the TARGET chain RPC URL: ');
  const targetTokenBridgeAddress = readlineSync.question('Enter the Token Bridge contract address on the TARGET chain: ');

  const providerSource = new ethers.JsonRpcProvider(sourceRpcUrl);
  const providerTarget = new ethers.JsonRpcProvider(targetRpcUrl);

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, providerSource);

  // Load the Token Bridge ABI (for attestToken and createWrapped functions)
  const tokenBridgeAbi =TokenAbi.abi; ;

  // Create the Token Bridge contract instances for source and target chains
  const tokenBridgeSource = new ethers.Contract(sourceTokenBridgeAddress, tokenBridgeAbi, wallet);
  const tokenBridgeTarget = new ethers.Contract(targetTokenBridgeAddress, tokenBridgeAbi, wallet.connect(providerTarget));

  // Ask for the token address on the source chain
  const tokenAddress = readlineSync.question('Enter the token contract address on the SOURCE chain: ');
  const nonce = readlineSync.questionInt('Enter a nonce value (e.g., 0): ');

  // Step 2: Call attestToken on the source chain
//   console.log('Calling attestToken on the source chain...');
//   const tx = await tokenBridgeSource.attestToken(tokenAddress, nonce, { gasLimit: 500000 });
//   console.log(`Transaction hash: ${tx.hash}`);
//   await tx.wait();
//   console.log('Attestation transaction confirmed.');

  // Step 3: Retrieve the signed VAA using Wormhole's REST API
//   const emitterChainId = readlineSync.questionInt('Enter the SOURCE chain Wormhole Chain ID (e.g., 2 for Ethereum): ');
//   const emitterAddress = await tokenBridgeSource.tokenBridgeEmitterAddress(); // Fetch the emitter address of the token bridge

//   const sequence = await tokenBridgeSource.sequence(); // Fetch the sequence number of the attestation
//   console.log(`Fetching signed VAA for emitterChainId=${emitterChainId}, emitterAddress=${emitterAddress}, sequence=${sequence}`);

//   const vaaResponse = await axios.get(`https://wormhole-v2-api.certus.one/v1/signed_vaa/${emitterChainId}/${emitterAddress}/${sequence}`);
//   const signedVAA = vaaResponse.data.vaa;

//   console.log('Signed VAA retrieved:', signedVAA);
 const signedVAA = ""

  // Step 4: Submit the signed VAA to the target chain's token bridge contract
  console.log('Submitting signed VAA to the target chain...');
  const createWrappedTx = await tokenBridgeTarget.createWrapped(signedVAA, { gasLimit: 500000 });
  console.log(`Transaction hash: ${createWrappedTx.hash}`);
  await createWrappedTx.wait();
  console.log('VAA submitted successfully. Token is now attested on the target chain.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});