import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';
import renderHTML from 'react-render-html';

import { convertNumberToTimeAgo } from '../src/helpers/convert-number-to-time-ago';
import { withDataAndRouter } from '../src/helpers/with-data';
import { BlankLayout } from '../src/layouts/blank-layout';
import { MainLayout } from '../src/layouts/main-layout';
import { logoutSuccessMessage } from './../src/data/validation/user';

import useSound from 'use-sound';
import { useSoundContext } from '../src/context/state';

const query = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      about
      creationTime
      email
      karma
    }
    me {
      id
    }
  }
`;

export interface IUserPageProps {
  router;
}

export interface IUserPageQuery {
  loading;
  error;
  user;
  me;
}

function UserPage(props: IUserPageProps): JSX.Element {
  
  const { router } = props;
  console.log(router.query);
  const userId = (router.query && router.query.id) || '';

  const { data } = useQuery<IUserPageQuery>(query, { variables: { id: userId } });

  useEffect(() => {
    if (router.query.logout) {
      logoutSuccessMessage();
    }

    window.history.replaceState(null, '', `/user?id=${router.query.id}`);
  }, [router.query.login]);

  if (data?.error) {
    return <BlankLayout>Error loading news items.</BlankLayout>;
  }
  if (!data?.user) {

    return <BlankLayout>No such user.</BlankLayout>;
  }

  let about = data?.user?.about || '';
  let email = data?.user?.email || '';

  const onAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    about = e.target.value;
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    email = e.target.value;
  };

  const url = `/user?id=${router.query.id}`;

  const { state } = useSoundContext();
  const [playClick] = useSound(
    '/click.mp3',
    { volume: 0.5 }
  );

  const handleSubmit = (e: React.FormEvent<HTMLInputElement>): void => {
      if (state) {
        playClick();
      }
  };

  if (data?.me && data?.user.id === data.me.id)
    return (
      <MainLayout currentUrl={router.pathname} isFooterVisible={true}>
        <tr>
          <td>
            <form className="profileform" method="post" action="/xuser" >
              <input type="hidden" name="id" value="clintonwoo" />
              <input type="hidden" name="hmac" value="71104445c3c41b4167c38db67a656e610d5fbad9" />
              <br/>
              <table style={{display: 'flex',  justifyContent:'center', alignItems:'center', border: '0px'}}>
                <tbody>
                  <tr className="athing">
                    <td style={{ verticalAlign: 'top' }}>user:</td>
                    <td>
                      <Link href="/user?id=clintonwoo">
                        <a className="hnuser" style={{ color: '#3c963c' }}>
                          {data?.user.id}
                        </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>created:</td>
                    <td>{convertNumberToTimeAgo(data?.user.creationTime)}</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>karma:</td>
                    <td>{data?.user.karma}</td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>about:</td>
                    <td>
                      <textarea
                        cols={60}
                        defaultValue={renderHTML(about)}
                        name="about"
                        onChange={onAboutChange}
                        rows={5}
                        style={{ fontSize: '-2' }}
                        wrap="virtual"
                      />
                      {/* <Link href="/formatdoc">
                        <a tabIndex={-1} style={{ color: '#afafaf' }}>
                          help
                        </a>
                      </Link> */}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>email:</td>
                    <td>
                      <input
                        type="text"
                        name="uemail"
                        defaultValue={email}
                        onChange={onEmailChange}
                        size={60}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>showdead:</td>
                    <td>
                      <select defaultValue="no" name="showd">
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>noprocrast:</td>
                    <td>
                      <select defaultValue="no" name="nopro">
                        <option value="yes">yes</option>
                        <option value="no">no</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>maxvisit:</td>
                    <td>
                      <input type="text" name="maxv" defaultValue="20" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>minaway:</td>
                    <td>
                      <input type="text" name="mina" defaultValue="180" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top' }}>delay:</td>
                    <td>
                      <input type="text" name="delay" defaultValue="0" size={16} />
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href="/changepw">
                        <a>
                          <u>change password</u>
                        </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href={`/submitted?id=${data?.user.id}`}>
                        <a>
                          <u>submissions</u>
                        </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href={`/threads?id=${data?.user.id}`}>
                        <a>
                          <u>comments</u>
                        </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href="/hidden">
                        <a>
                          <u>hidden</u>
                        </a>
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href="/upvoted?id=clintonwoo">
                        <a>
                          <u>upvoted submissions</u>
                        </a>
                      </Link>
                      {' / '}
                      <Link href="/upvoted?id=clintonwoo&comments=t">
                        <a>
                          <u>comments</u>
                        </a>
                      </Link>
                      &nbsp;&nbsp;
                      <span style={{ fontStyle: 'italic' }}>(private)</span>
                    </td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <Link href="/favorites?id=clintonwoo">
                        <a>
                          <u>favorite submissions</u>
                        </a>
                      </Link>
                      {' / '}
                      <Link href="/favorites?id=clintonwoo&amp;comments=t">
                        <a>
                          <u>comments</u>
                        </a>
                      </Link>
                      &nbsp;&nbsp;
                      <span style={{ fontStyle: 'italic' }}>(shared)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />
            </form>
            <br />
            <br />
          </td>
        </tr>
      </MainLayout>
    );

  return (
    <MainLayout currentUrl={router.pathname} isFooterVisible={true}>
      <tr>
        <td>
          <br/>
          <table style={{display: 'flex',  justifyContent:'center', alignItems:'center', border: '0px'}}>
            <tbody>
              <tr className="athing">
                <td style={{ verticalAlign: 'top' }}>user:</td>
                <td>
                  <a href={`user?id=${data?.user?.id}`} className="hnuser">
                    {data?.user.id}
                  </a>
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top' }}>created:</td>
                <td>{convertNumberToTimeAgo(data?.user.creationTime)}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top' }}>karma:</td>
                <td>{data?.user.karma}</td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'top' }}>about:</td>
                <td>{data?.user.about && renderHTML(data?.user.about)}</td>
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`submitted?id=${data?.user.id}`}>
                    <u>submissions</u>
                  </a>
                </td>
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`threads?id=${data?.user.id}`}>
                    <u>comments</u>
                  </a>
                </td>
              </tr>
              <tr>
                <td />
                <td>
                  <a href={`favorites?id=${data?.user.id}`}>
                    <u>favorites</u>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
        </td>
      </tr>
    </MainLayout>
  );
}

export default withDataAndRouter(UserPage);
