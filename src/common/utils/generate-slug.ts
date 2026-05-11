import { Repository } from "typeorm";
import slugify from 'slugify'

export async function generateUniqueSlug(
    title: string,
    repository: Repository<any>
): Promise<string> {
    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
    });

    let slug = baseSlug;

    let counter = 1;

    while (true) {
        const existing = await repository.findOne({
            where: { slug },
        });

        if (!existing) {
            break;
        }

        slug = `${baseSlug}-${counter}`;

        counter++;
    }


    return slug;
}