import { Share } from 'react-native';
import { Spark } from '../types/spark';
import { Config } from '../constants/config';

export async function shareSpark(spark: Spark): Promise<void> {
  const message =
    `✨ Daily Spark — ${spark.topicLabel}\n\n` +
    `${spark.emoji} ${spark.text}\n\n` +
    `Get amazing sparks every day 👉 ${Config.APP_URL}`;

  await Share.share(
    {
      message,
      title: 'Daily Spark ⚡',
    },
    {
      dialogTitle: 'Share this Spark',
    }
  );
}
