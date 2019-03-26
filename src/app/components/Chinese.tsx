import * as React from 'react';
import styled from 'styled-components';
import posed from 'react-pose';
import { range, sample } from 'lodash';
import { pinyin, applyAccents } from '../helpers/chinese';
import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  Icon,
  Input,
  Text,
  Tooltip,
  colors
} from './common/common';
import { wait, cache } from '../helpers/utils';

const CACHE_KEY = '@@pinyin';

const PosedCard = posed(Card)({
  enter: {
    x: 80,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -80,
    opacity: 0
  }
});

const PosedSmallCard = posed(Card)({
  hoverable: true,
  init: {
    scale: 1,
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
  },
  hover: {
    scale: 1.1,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
  }
});

const PressableIcon = styled(Icon)`
  cursor: pointer;

  &:hover {
    color: #1890ff;
  }
`;

const FadedIcon = styled(Icon)`
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

type ChineseProps = {};
type ChineseState = {
  pinyin: string[];
  current: number;
  history: number[];
  checked: string[];
  pinned: string[];
  type: 'practice' | 'search';
  pose: 'enter' | 'visible' | 'exit' | null;
  shuffle: boolean;
  query: string;
};

class Chinese extends React.Component<ChineseProps, ChineseState> {
  constructor(props: ChineseProps) {
    super(props);

    this.state = {
      pinyin,
      current: 0,
      history: [],
      checked: [],
      pinned: cache.get(CACHE_KEY) || [],
      type: 'practice',
      pose: 'enter',
      shuffle: false,
      query: ''
    };
  }

  audio: HTMLAudioElement;

  componentDidMount() {
    this.setState({ pose: 'visible' });
  }

  setUpAudio = (audio: HTMLAudioElement) => {
    this.audio = audio;
  };

  getCharsUrl = (chars: string, tone: number) => {
    const base =
      'https://yabla.vo.llnwd.net/media.yabla.com/chinese_static/audio/alicia';
    const sanitized = chars.replace('ü', 'v');

    return `${base}/${sanitized}${tone}.mp3`;
  };

  handleCharTransition = (cb: () => void, reverse?: boolean) => {
    // Bleh
    return Promise.resolve()
      .then(() => this.setState({ pose: reverse ? 'enter' : 'exit' }))
      .then(() => wait(80))
      .then(() => cb())
      .then(() => wait(80))
      .then(() => this.setState({ pose: 'visible' }));
  };

  handleNextChar = () => {
    return this.handleCharTransition(() => {
      const { pinyin = [], current, history = [] } = this.state;
      const next = (current + 1) % pinyin.length;

      this.setState({
        current: next,
        pose: 'enter',
        history: history.concat(current)
      });
    });
  };

  handlePrevChar = () => {
    return this.handleCharTransition(() => {
      const { pinyin = [], current, history = [] } = this.state;

      let next =
        current === 0 ? pinyin.length - 1 : (current - 1) % pinyin.length;

      if (history && history.length) {
        next = history.pop();
      }

      this.setState({ current: next, pose: 'exit', history });
    }, true);
  };

  handleRandomChar = () => {
    return this.handleCharTransition(() => {
      const { pinyin = [], current, history = [] } = this.state;
      const options = pinyin.reduce((acc, chars, index) => {
        if (index !== current && history.indexOf(index) === -1) {
          return acc.concat(index);
        }

        return acc;
      }, []);
      const next = sample(options) % pinyin.length || 0;
      console.log('History:', history);

      this.setState({
        current: next,
        pose: 'enter',
        history:
          history.length === pinyin.length
            ? [].concat(current)
            : history.concat(current)
      });
    });
  };

  handleSelectChars = (chars: string) => {
    if (this.state.pinyin[this.state.current] === chars) {
      return;
    }

    return this.handleCharTransition(() => {
      const { pinyin = [], current, history = [] } = this.state;
      const next = pinyin.indexOf(chars);

      this.setState({
        current: next,
        pose: 'enter',
        history: history.concat(current)
      });
    });
  };

  handlePlayAudio = (chars: string, tone: number) => {
    const url = this.getCharsUrl(chars, tone);

    this.audio.src = url;
    this.audio.play();
  };

  handlePlayPinnedAudio = (e: any, chars: string) => {
    e.stopPropagation();
    this.handlePlayAudio(chars, 1);
  };

  handleToggleChecked = (chars: string, isChecked: boolean) => {
    const { checked = [] } = this.state;
    const update = isChecked
      ? checked.filter(c => chars !== c)
      : checked.concat(chars);

    this.setState({ checked: update });
  };

  handleTogglePinned = (chars: string, isPinned: boolean) => {
    const { pinned = [] } = this.state;
    const update = isPinned
      ? pinned.filter(p => chars !== p)
      : pinned.concat(chars);

    this.setState({ pinned: update });
    cache.set(CACHE_KEY, update);
  };

  renderCheckIcon(chars: string) {
    const { checked = [] } = this.state;
    const isChecked = checked.indexOf(chars) !== -1;
    const props = isChecked
      ? { theme: 'twoTone', twoToneColor: '#52c41a' }
      : {};

    return (
      <Tooltip
        placement="top"
        title={
          <Text textAlign="center">
            Mark this as complete to prevent it from showing up in Shuffle
          </Text>
        }
      >
        <Box
          style={{ cursor: 'pointer' }}
          onClick={() => this.handleToggleChecked(chars, isChecked)}
        >
          <Icon type="check-circle" {...props} />
        </Box>
      </Tooltip>
    );
  }

  renderPinIcon(chars: string) {
    const { pinned = [] } = this.state;
    const isPinned = pinned.indexOf(chars) !== -1;
    const props = isPinned ? { theme: 'twoTone', twoToneColor: '#eb2f96' } : {};

    return (
      <Tooltip
        placement="top"
        title={
          <Text textAlign="center">Flag this pinyin as one to practice</Text>
        }
      >
        <Box
          style={{ cursor: 'pointer' }}
          onClick={() => this.handleTogglePinned(chars, isPinned)}
        >
          <Icon type="pushpin" {...props} />
        </Box>
      </Tooltip>
    );
  }

  renderCard(chars: string, { animate }: { animate: boolean }) {
    const { pose } = this.state;

    return (
      <PosedCard
        key={chars}
        style={{ maxWidth: 640 }}
        bg={colors.white}
        borderRadius={4}
        boxShadow="0 1px 4px rgba(0, 0, 0, 0.1)"
        fontSize={4}
        flex={['none', 1]}
        width={[300, 1]}
        py={3}
        px={4}
        my={[2, 3]}
        pose={animate ? pose : 'visible'}
      >
        <Flex justifyContent="space-between" fontSize={2}>
          <Box>{/* {this.renderCheckIcon(chars)} */}</Box>

          {this.renderPinIcon(chars)}
        </Flex>

        <Flex justifyContent="center" mb={2}>
          {chars}
        </Flex>

        <Flex
          mt={3}
          justifyContent="space-between"
          alignItems="center"
          flexDirection={['column', 'row']}
        >
          {[1, 2, 3, 4].map(tone => {
            const label = applyAccents(chars, tone);

            return (
              <Button
                key={tone}
                style={{ minWidth: 100, maxWidth: 120 }}
                px={3}
                py={1}
                mb={[1, 0]}
                fontSize={1}
                type="default"
                onClick={() => this.handlePlayAudio(chars, tone)}
              >
                <Icon type="play-circle" theme="twoTone" />
                {/* {`${label} Tone`} */}
                {label}
              </Button>
            );
          })}
        </Flex>
      </PosedCard>
    );
  }

  renderSmallCard(chars: string) {
    return (
      <PosedSmallCard
        key={chars}
        style={{ minWidth: 64, cursor: 'pointer' }}
        bg={colors.white}
        borderRadius={4}
        boxShadow="0 1px 4px rgba(0, 0, 0, 0.1)"
        fontSize={1}
        px={2}
        py={1}
        m={1}
        onClick={() => this.handleSelectChars(chars)}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <FadedIcon
            type="sound"
            theme="twoTone"
            onClick={(e: any) => this.handlePlayPinnedAudio(e, chars)}
          />
          <Text mx={2}>{chars}</Text>
          {/* <Icon type="plus-circle" /> */}
        </Flex>
      </PosedSmallCard>
    );
  }

  renderPracticeCard() {
    const { pinyin = [], current } = this.state;
    const chars = pinyin[current] || pinyin[0];

    return (
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Box fontSize={3} fontWeight={100}>
            <PressableIcon type="left" onClick={this.handlePrevChar} />
          </Box>

          {this.renderCard(chars, { animate: true })}

          <Box fontSize={3} fontWeight={100}>
            <PressableIcon type="right" onClick={this.handleNextChar} />
          </Box>
        </Flex>

        <Flex
          mt={4}
          mb={2}
          justifyContent="center"
          fontSize={4}
          fontWeight={100}
        >
          <Button
            px={4}
            py={1}
            fontSize={1}
            type="primary"
            onClick={this.handleRandomChar}
          >
            Shuffle
          </Button>
        </Flex>
      </Box>
    );
  }

  renderPinnedChars() {
    const { pinned = [] } = this.state;

    return (
      <Box style={{ minHeight: 40, maxWidth: 640 }} mx="auto">
        <Flex flexWrap="wrap">
          {pinned.map(chars => {
            return this.renderSmallCard(chars);
          })}
        </Flex>
      </Box>
    );
  }

  renderSearchResults() {
    const { pinyin = [], query } = this.state;
    const hasQuery = !!query;

    return (
      <Box style={{ maxWidth: 640 }} width={[300, 1]} mx="auto">
        <Flex mt={4} mb={3} justifyContent="center">
          <Input
            px={3}
            py={2}
            mb={2}
            fontSize={2}
            type="text"
            placeholder={`Search for something (e.g. "xi")`}
            value={query}
            onChange={(e: any) => this.setState({ query: e.target.value })}
          />
        </Flex>

        {hasQuery && (
          <Flex alignItems="center" flexDirection="column">
            {pinyin
              .filter(chars => {
                const str = chars.replace('ü', 'u').toLowerCase();

                return str.indexOf(query.toLowerCase()) !== -1;
              })
              .slice(0, 20)
              .map(chars => {
                return this.renderCard(chars, { animate: false });
              })}
          </Flex>
        )}
      </Box>
    );
  }

  render() {
    return (
      <Box style={{ maxWidth: 960 }} px={[3, 4, 5]} py={5} mx="auto">
        {this.renderPracticeCard()}
        {this.renderPinnedChars()}
        <Divider />
        {this.renderSearchResults()}
        <audio id="player" src={null} controls hidden ref={this.setUpAudio} />
      </Box>
    );
  }
}

export default Chinese;
