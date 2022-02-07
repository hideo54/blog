import { ChevronBack } from '@styled-icons/ionicons-outline';
import { IconNextLink } from '@hideo54/reactor';
import Layout from '../components/Layout';

const App = () => {
    return (
        <Layout title='ページが見つかりませんでした | いうていけろ - hideo54のブログ'>
            <IconNextLink href='/' LeftIcon={ChevronBack}>トップページ</IconNextLink>
            <section style={{ textAlign: 'center' }}>
                <h2>404 Not Found</h2>
                <p>ページが見つかりませんでした。URLが間違っているか、記事が削除されています。</p>
            </section>
        </Layout>
    );
};

export default App;
