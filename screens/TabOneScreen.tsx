import * as React from 'react';
import { StyleSheet, FlatList, StatusBar, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { usePosts, Post } from '../hooks/lotide';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const posts = usePosts();
  const renderItem = ({ item }: {item: Post}) => (
    <Item post={item} />
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={posts.filter(post => post.href.endsWith(".jpg"))}
        renderItem={renderItem}
        keyExtractor={(post, index) => `${post.id}-${index}`}
        refreshing={posts.length === 0}
        onRefresh={() => console.log("refreshed")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#000000',
    padding: 20,
    marginVertical: 0,
    marginHorizontal: 0,
    borderBottomColor: "#5555",
    borderBottomWidth: 8,
  },
  title: {
    fontSize: 32,
  },
  contentText: {
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: undefined,
    resizeMode: 'contain',
    aspectRatio: 1,
  }
});


const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

const Item = ({post}: {post: Post}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{post.title}</Text>
    {post.href.endsWith(".jpg") &&
      <Image style={styles.image} source={{
        uri: post.href,
      }}/>
    }
    <Text style={styles.contentText}>{post.content_text}</Text>
    <Text>{post.score}</Text>
  </View>
);
