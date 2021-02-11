import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export default function Home({ launches }) {
  console.log('launches', launches);
  return (
    <div className={styles.container}>
      <Head>
        <title>Space-X Launches</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          {launches.map(launch => {
            return (
              <a key={launch.id} href={launch.links.video_link} className={styles.card}>
                <h3>{launch.mission_name}</h3>
                {/* {console.log(launch.links.mission_patch)} */}
                {/* <Image
                  // src="/me.png"
                  src={`${launch.links.mission_patch}`}
                  alt="Mission Patch"
                  width={500}
                  height={500}
                /> */}
                <img src={`${launch.links.mission_patch}`} alt="" width={100} />
                <p><strong>Launch Date:</strong> {new Date(launch.launch_date_local).toLocaleDateString("en-US")}
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'https://api.spacex.land/graphql/',
    cache: new InMemoryCache()
  })
  const { data } = await client.query({
    query: gql`
      query GetLaunches {
        launchesPast(limit: 10) {
          id
          mission_name
          launch_date_local
          launch_site {
            site_name_long
          }
          links {
            article_link
            video_link
            mission_patch
          }
          rocket {
            rocket_name
          }
        }
      }
    `
  });
  return {
    props: {
      launches: data.launchesPast
    }
  }
}