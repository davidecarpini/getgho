import { ConnectKitButton } from 'connectkit';
import {
    Button,
    Input,
    VStack,
    Icon,
    HStack,
    Heading,
    IconButton,
    Image,
    Text,
    Box,
    useColorModeValue,
    Spinner
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useState } from 'react';
import { FaArrowLeft, FaCheck, FaKey } from 'react-icons/fa6';
import ghost from '../assets/ghost.png';
import { WalletCreationStep, useWalletCreationStep } from '@repo/lfgho-sdk';
import Lottie from 'react-lottie';
import ghostAnimation from '../assets/ghost-lottie.json';

type Props = {
    login: () => void;
    signup: (walletName: string) => Promise<void>;
};

type Steps = 'main' | 'alreadyHaveWallet' | 'createWallet' | 'connectWallet';

const OnboardingBody = ({ login, signup }: Props) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const { walletCreationStep } = useWalletCreationStep();
    const [step, setStep] = useState<Steps>('main');
    const borderColor = useColorModeValue('black', 'white');

    const [showGhost, setShowGhost] = useState(false);

    useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                setShowGhost(true);
            }
        });
        window.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                setShowGhost(false);
            }
        });
    });

    if (walletCreationStep === WalletCreationStep.CreatingWallet) {
        return (
            <HStack spacing={4}>
                <Text>Creating local wallet...</Text>
                <Spinner />
            </HStack>
        );
    }

    if (walletCreationStep === WalletCreationStep.RequestingSignature) {
        return (
            <HStack spacing={4}>
                <Text>Requesting signature...</Text>
                <Spinner />
            </HStack>
        );
    }

    if (walletCreationStep === WalletCreationStep.DeployingWallet) {
        return (
            <VStack spacing={4}>
                <VStack spacing={4}>
                    <HStack spacing={4}>
                        <Text>Deploying the smart wallet...</Text>
                        <Spinner />
                    </HStack>
                    <Text>
                        someone is waiting with you... hold{' '}
                        <strong>'space' </strong> to reveal
                    </Text>
                </VStack>
                <Lottie
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        opacity: showGhost ? 1 : 0,
                        transition: 'opacity 0.5s ease-in-out'
                    }}
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: ghostAnimation
                    }}
                    height={200}
                    width={200}
                />
            </VStack>
        );
    }

    if (step === 'alreadyHaveWallet') {
        return (
            <HStack>
                <IconButton
                    size="sm"
                    aria-label="Go back"
                    variant={'ghost'}
                    icon={<Icon as={FaArrowLeft} />}
                    onClick={() => setStep('main')}
                />
                <HStack spacing={4}>
                    <Button
                        colorScheme="black"
                        variant={'outline'}
                        size={'lg'}
                        onClick={login}
                        leftIcon={<Icon as={FaKey} />}
                    >
                        Passkey
                    </Button>
                    <Text>or</Text>
                    <ConnectKitButton.Custom>
                        {({ isConnected, show, address }) => {
                            return (
                                <Button
                                    colorScheme="black"
                                    variant={'outline'}
                                    size={'lg'}
                                    onClick={show}
                                >
                                    {isConnected ? address : 'Connect Wallet'}
                                </Button>
                            );
                        }}
                    </ConnectKitButton.Custom>
                </HStack>
            </HStack>
        );
    }

    if (step === 'createWallet') {
        return (
            <HStack>
                <IconButton
                    size="sm"
                    aria-label="Go back"
                    variant={'ghost'}
                    icon={<Icon as={FaArrowLeft} />}
                    onClick={() => setStep('main')}
                />
                <Input
                    variant="outline"
                    type="text"
                    placeholder="Wallet name ..."
                    onChange={handleInputChange}
                    value={inputValue}
                    borderColor={borderColor}
                    _placeholder={{ color: borderColor, opacity: 0.5 }}
                    _hover={{ borderColor: { borderColor } }}
                />
                <IconButton
                    size="sm"
                    variant={'ghost'}
                    aria-label="Confirm"
                    colorScheme="green"
                    icon={<Icon as={FaCheck} />}
                    isDisabled={!inputValue}
                    onClick={() => signup(`LFGHO - ${inputValue}`)}
                />
            </HStack>
        );
    }

    return (
        <VStack spacing={4}>
            <Button
                colorScheme="black"
                variant={'outline'}
                size={'lg'}
                onClick={() => setStep('createWallet')}
            >
                Create wallet
            </Button>
            <Button
                variant={'link'}
                colorScheme="black"
                onClick={() => setStep('alreadyHaveWallet')}
            >
                Already have a wallet?
            </Button>
        </VStack>
    );
};

export const Onboarding = ({ login, signup }: Props) => {
    return (
        <VStack spacing={70}>
            <VStack>
                <HStack>
                    <Image src={ghost} w={100} />
                    <VStack alignItems={'flex-start'}>
                        <Heading fontSize={30}>GetGho</Heading>
                        <Text fontSize={13}>
                            Owning Gho has never been so easy
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
            <Box minH={100}>
                <OnboardingBody login={login} signup={signup} />
            </Box>
        </VStack>
    );
};
