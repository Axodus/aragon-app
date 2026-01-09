import { metadataUtils } from './metadataUtils';

describe('metadata utils', () => {
    it('builds metadata with expected structure', () => {
        const title = 'title';
        const description = 'description';
        const image = 'https://image.png';
        const type = 'article';

        const result = metadataUtils.buildMetadata({ title, description, image, type });

        expect(result).toEqual({
            title,
            description,
            openGraph: { title, description, siteName: 'Community DAO', images: [image], type },
            twitter: { card: 'summary', site: '@governancecountry', title, description, images: [image] },
        });
    });
});
