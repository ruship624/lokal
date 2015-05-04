import tweepy
import json
from pymongo import MongoClient
from datetime import datetime
import sys
import ast
out_file = open('./out_file.txt','w')


class CustomStreamListener(tweepy.StreamListener):
    #creates a MongoClient to the running mongod instance
    def __init__(self, api):
        self.api = api
        super(tweepy.StreamListener, self).__init__()

        self.db = MongoClient('mongodb://localhost:27017/').lokal #<---Not needed, but can add database to it
        self.db.tweets.remove()
        self.db.tweets.create_index("insertedAt", expireAfterSeconds=30)
        print "Did the init"

        

    def on_data(self, tweet):
        try:
            #print "data"
            tweet_data = json.loads(tweet)
            #print tweet_data['entities']
            img_url = None
            try:
                print tweet_data['entities']['urls']
                for url in tweet_data['entities']['urls']:
                    if "photo" in url['expanded_url']:
                        img_url = url['expanded_url']
            except:
                img_url = None
            clean_tweet = {'text': tweet_data['text'], 'time': tweet_data['created_at'],\
                           'insertedAt': datetime.utcnow(),\
                           'locationx': tweet_data['coordinates']['coordinates'][0],\
                           'locationy': tweet_data['coordinates']['coordinates'][1],\
                           'user': tweet_data['user']['screen_name'],\
                           'reply_to': tweet_data['in_reply_to_screen_name'],\
                           'image': img_url}
            
            print clean_tweet['text']
            print str(clean_tweet)

            self.db.tweets.insert(clean_tweet)
        except:
            pass
    def on_error(self, status_code):
        print "error"
        print status_code


def main():

    coords = sys.argv[1]
    coords = "["+coords.replace("a", ".").replace("b", "-").replace("c",",")+"]"
    print coords
    keys = ['VXPrlNSLZDwrFItHMlz6Nk7pu','sOlV6iZAuitpxodsp4GN5j3E5YEWsxVrA2KnBmXLH7bBIT9ERk',\
            '37540821-UCFtwa0nVC5fECEldWLrTyxIkMOSRzu8VYlluLJsj', 'Ry37tIpZ6VJ5HFZGQZTYS8PwjlAnyfAOmhc9aKaAWpdVS']
    #my_location = [-73.7927,41.1126,-73.8778,41.0293]
    my_location = ast.literal_eval(coords)
    my_location = [my_location[1], my_location[0], my_location[3], my_location[2]]
    print my_location

    auth = tweepy.OAuthHandler(keys[0], keys[1])
    auth.set_access_token(keys[2], keys[3])
    api = tweepy.API(auth)
    print "connecting to stream"
    sapi = tweepy.streaming.Stream(auth, CustomStreamListener(api))
    sapi.filter(locations=my_location)

if __name__ == '__main__':
    main()