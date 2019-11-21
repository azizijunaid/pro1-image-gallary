import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  PermissionsAndroid,
} from 'react-native';

import FastImage from 'react-native-fast-image';
import RNFetchBlob from 'rn-fetch-blob';
import BackgroundColor from 'react-native-background-color';

export async function request_storage_runtime_permission() {

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'ReactNativeCode Storage Permission',
        'message': 'ReactNativeCode App needs access to your storage to download Photos.'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

      // Alert.alert("Storage Permission Granted.");
    }
    else {

      Alert.alert("Storage Permission Not Granted");

    }
  } catch (err) {
    console.warn(err)
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageuri: '',
      ModalVisibleStatus: false,
      loading: false
    };
  }

  ShowModalFunction(visible, imageURL) {
    //handler to handle the click on image of Grid
    //and close button on modal
    this.setState({
      ModalVisibleStatus: visible,
      imageuri: imageURL,
    });
  }

  async componentDidMount() {
    BackgroundColor.setColor('#FFFFFF');
    var that = this;
    let items = Array.apply(null, Array(300)).map((v, i) => {
      return { id: i, src: 'https://unsplash.it/400/400?image=' + (i + 1) };
    });
    that.setState({
      dataSource: items,
    });

    await request_storage_runtime_permission()

  }

  downloadImage = (image_URL) => {
    try {
      console.log('downloadImage', image_URL)
      this.setState({ loading: true })
      let date = new Date();
      let ext = this.getExtention(image_URL);
      ext = "." + ext[0];
      const { config, fs } = RNFetchBlob;
      let PictureDir = fs.dirs.PictureDir;
      console.log("PictureDir", PictureDir)
      let options = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + "/image_" + Math.floor(date.getTime()
            + date.getSeconds() / 2) + ext,
          description: 'Image'
        }
      }
      config(options)
      .fetch('GET', image_URL)
      .then((res) => {
        console.log("res", res)
        const status = res.info().status;
        if(status == 200){
          this.setState({ loading: false })
          Alert.alert("Image Downloaded Successfully.");
        }else{
          console.log("status", status)
        }
      });
    } catch (error) {
      this.setState({ loading: false })
      console.log("error", error);
    }
  }

  getExtention = (filename) => {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) :
      undefined;
  }

  render() {
    if (this.state.ModalVisibleStatus) {
      return (

        <View >
          {/* {this.state.loading && <View>
            <Text>Loading...</Text>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>} */}

          <Modal
            transparent={false}
            animationType={'fade'}
            visible={this.state.ModalVisibleStatus}
            onRequestClose={() => {
              this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
            }}>
            <View style={styles.modelStyle}>
              <FastImage
                style={styles.fullImageStyle}
                source={{ uri: this.state.imageuri }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.closeButtonStyle}
                onPress={() => {
                  this.ShowModalFunction(!this.state.ModalVisibleStatus, '');
                }}>
                <FastImage
                  source={{
                    uri:
                      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/close.png',
                  }}
                  style={{ width: 35, height: 35, marginTop: 16 }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                // activeOpacity={0.5}
                style={styles.DownButtonStyle}
                onPress={this.downloadImage.bind(this, this.state.imageuri)}
              >
                <FastImage
                  source={{
                    uri:
                      'https://i-love-png.com/images/32391-200.png',
                  }}
                  style={{ width: 35, height: 35, marginTop: 16 }}
                />
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text
            style={{
              padding: 15,
              fontSize: 15,
              color: 'white',
              backgroundColor: 'orange',
            }}>
            Image Gallery
          </Text>
          <FlatList
            data={this.state.dataSource}
            renderItem={({ item }) => (
              <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                <TouchableOpacity
                  key={item.id}
                  style={{ flex: 1 }}
                  onPress={() => {
                    this.ShowModalFunction(true, item.src);
                  }}>
                  <FastImage
                    style={styles.image}
                    source={{
                      uri: item.src,
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  button: {

    width: '80%',
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#2E7D32',
    borderRadius: 7,
    margin: 10
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    padding: 5
  },
  container: {
    flex: 1,
    marginTop: 30,
  },
  image: {
    height: 120,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  modelStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  closeButtonStyle: {
    width: 25,
    height: 25,
    top: 9,
    right: 15,
    position: 'absolute',
  },

  DownButtonStyle: {
    borderRadius: 50,
    width: 30,
    height: 30,
    top: 9,
    right: 100,
    position: 'absolute',
  },
});