## Android Develoment Documentation

项目使用Capacitor作为原生的 Android 运行时环境，使得开发者能够将 JavaScript 与 Native Java 或 Kotlin 代码进行交互。Android 应用程序通过 Android Studio 配置和管理。

### Android Webview Support[](https://capacitorjs.com/docs/android#android-support)

支持 API 23+ (Android 6 或更高版本)。这代表了大约 99% 的 Android 市场份额。Capacitor 需要一个 [Android System WebView](https://play.google.com/store/apps/details?id=com.google.android.webview)，其 Chrome 内核版本为 60 及以上。在 Android 6 和 10 及以后版本中，Capacitor 使用 Android 系统 WebView。在 Android 7-9 中，Google Chrome 提供 WebView。

### Adding the Android Platform[](https://capacitorjs.com/docs/android#adding-the-android-platform)

First, install the `@capacitor/android` package.

```bash
yarn add @capacitor/android
```

Then, add the Android platform.

```bash
npx cap add android
```

To 

```
npx cap sync
```

To open the project in Android Studio, run:

```bash
npx cap open android
```

Alternatively, you can open Android Studio and import the `android/` directory as an Android Studio project.
你可以打开 Android Studio 并将 `android/` 目录作为 Android Studio 项目导入。(这需要很长的一段时间)

### Running Your App 

You are encouraged to run your app with Android Studio.

> To use an Android Emulator you must use an API 24+ system image. The System WebView does not automatically update on emulators. Physical devices should work as low as API 23 as long as their System WebView is updated.
> 要使用 Android 模拟器，请务必使用系统图像版本为 24 及以上。模拟器中的系统 WebView 不会自动更新。只要物理设备的系统 WebView 已经更新，它们应可以在最低的 API 级别 23 上正常工作。

To run the project on a device or emulator, run:
要运行项目，请在设备或模拟器上运行：

```bash
npx cap run android
```

> Either a physical Android device or a downloaded emulator system image is required to use the `run` command. See the [documentation here for creating emulator devices and downloading system images in Android Studio](https://developer.android.com/studio/run/managing-avds).
> 需要一个物理的 Android 设备或者下载一个系统镜像来使用 `run` 命令。请参阅 Android Studio 中的文档，以创建模拟器设备并下载系统镜像。

### Running with Android Studio 运行 Android Studio[](https://capacitorjs.com/docs/android#running-with-android-studio)

In Android Studio, first select the device or emulator and then click the run or debug button to run your app. Unless you're debugging Java or Kotlin code, the run button is preferred.
在 Android Studio 中，首先选择设备或模拟器，然后点击运行或调试按钮以运行您的应用。除非您正在调试 Java 或 Kotlin 代码，否则首选运行按钮。

![Running App](https://capacitorjs.com/docs/assets/images/running-a42ce0daf3b9d2dd5ee6b94d1c378220.png)

